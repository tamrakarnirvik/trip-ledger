"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Eye,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  UsersRound,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Modal,
} from "@/components/ui/modal";


type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
};


type AdminUserManagerProps = {
  users: AdminUser[];
  currentUserId: string;
};


type RoleFilter =
  | "ALL"
  | "TREASURER"
  | "FRIEND";


type VerificationFilter =
  | "ALL"
  | "VERIFIED"
  | "PENDING";


type ModalView =
  | "details"
  | "role"
  | "delete"
  | null;


function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(
    new Date(
      value
    )
  );
}


export function AdminUserManager({
  users,
  currentUserId,
}: AdminUserManagerProps) {
  const router =
    useRouter();


  const [
    search,
    setSearch,
  ] =
    useState("");


  const [
    roleFilter,
    setRoleFilter,
  ] =
    useState<RoleFilter>(
      "ALL"
    );


  const [
    verificationFilter,
    setVerificationFilter,
  ] =
    useState<VerificationFilter>(
      "ALL"
    );


  const [
    openMenuId,
    setOpenMenuId,
  ] =
    useState<string | null>(
      null
    );


  const [
    selectedUser,
    setSelectedUser,
  ] =
    useState<AdminUser | null>(
      null
    );


  const [
    modalView,
    setModalView,
  ] =
    useState<ModalView>(
      null
    );


  const [
    roleDraft,
    setRoleDraft,
  ] =
    useState<
      "TREASURER" |
      "FRIEND"
    >(
      "FRIEND"
    );


  const [
    deleteConfirmation,
    setDeleteConfirmation,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  /*
   * Close action menu when clicking elsewhere.
   */
  useEffect(() => {
    function handlePointerDown(
      event: PointerEvent
    ) {
      const target =
        event.target as HTMLElement;


      if (
        !target.closest(
          "[data-user-menu]"
        )
      ) {
        setOpenMenuId(
          null
        );
      }
    }


    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setOpenMenuId(
          null
        );
      }
    }


    window.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      window.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);


  /*
   * Search + filters.
   */
  const filteredUsers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();


      return users.filter(
        (user) => {
          const matchesSearch =
            !query ||
            user.name
              .toLowerCase()
              .includes(
                query
              ) ||
            user.email
              .toLowerCase()
              .includes(
                query
              );


          const matchesRole =
            roleFilter ===
              "ALL" ||
            user.role ===
              roleFilter;


          const matchesVerification =
            verificationFilter ===
              "ALL" ||
            (
              verificationFilter ===
                "VERIFIED" &&
              user.emailVerified
            ) ||
            (
              verificationFilter ===
                "PENDING" &&
              !user.emailVerified
            );


          return (
            matchesSearch &&
            matchesRole &&
            matchesVerification
          );
        }
      );
    }, [
      users,
      search,
      roleFilter,
      verificationFilter,
    ]);


  const verifiedCount =
    users.filter(
      (user) =>
        user.emailVerified
    ).length;


  function openDetails(
    user: AdminUser
  ) {
    setSelectedUser(
      user
    );

    setError(
      ""
    );

    setOpenMenuId(
      null
    );

    setModalView(
      "details"
    );
  }


  function openRoleModal(
    user: AdminUser
  ) {
    setSelectedUser(
      user
    );

    setRoleDraft(
      user.role ===
        "TREASURER"
        ? "TREASURER"
        : "FRIEND"
    );

    setError(
      ""
    );

    setOpenMenuId(
      null
    );

    setModalView(
      "role"
    );
  }


  function openDeleteModal(
    user: AdminUser
  ) {
    setSelectedUser(
      user
    );

    setDeleteConfirmation(
      ""
    );

    setError(
      ""
    );

    setOpenMenuId(
      null
    );

    setModalView(
      "delete"
    );
  }


  function closeModal() {
    if (loading) {
      return;
    }


    setSelectedUser(
      null
    );

    setModalView(
      null
    );

    setError(
      ""
    );

    setDeleteConfirmation(
      ""
    );
  }


  async function handleRoleChange() {
    if (
      !selectedUser
    ) {
      return;
    }


    try {
      setLoading(
        true
      );

      setError(
        ""
      );


      const response =
        await fetch(
          `/api/admin/users/${selectedUser.id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                role:
                  roleDraft,
              }),
          }
        );


      const data =
        await response
          .json()
          .catch(
            () => null
          );


      if (
        !response.ok
      ) {
        throw new Error(
          data?.error ??
            "Unable to change role."
        );
      }


      setModalView(
        null
      );

      setSelectedUser(
        null
      );


      router.refresh();

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to change role."
      );
    } finally {
      setLoading(
        false
      );
    }
  }


  async function handleDelete() {
    if (
      !selectedUser
    ) {
      return;
    }


    try {
      setLoading(
        true
      );

      setError(
        ""
      );


      const response =
        await fetch(
          `/api/admin/users/${selectedUser.id}`,
          {
            method:
              "DELETE",
          }
        );


      const data =
        await response
          .json()
          .catch(
            () => null
          );


      if (
        !response.ok
      ) {
        throw new Error(
          data?.error ??
            "Unable to delete account."
        );
      }


      setModalView(
        null
      );

      setSelectedUser(
        null
      );

      setDeleteConfirmation(
        ""
      );


      router.refresh();

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete account."
      );
    } finally {
      setLoading(
        false
      );
    }
  }


  return (
    <>

      <section
        className="
          mt-5
          rounded-[24px]
          border
          border-zinc-200
          bg-white
          shadow-sm
        "
      >

        {/* =========================
            HEADER
        ========================= */}

        <div
          className="
            border-b
            border-zinc-100
            px-5
            py-5

            sm:px-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <UsersRound
                  size={17}
                  className="text-zinc-400"
                />


                <h2
                  className="
                    text-base
                    font-semibold
                    text-zinc-950
                  "
                >
                  Registered Users
                </h2>

              </div>


              <p
                className="
                  mt-1
                  text-xs
                  text-zinc-500
                "
              >
                {users.length} accounts · {verifiedCount} verified
              </p>

            </div>


            {/* SEARCH */}

            <div
              className="
                relative
                w-full

                lg:max-w-xs
              "
            >

              <Search
                size={16}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-zinc-400
                "
              />


              <input
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
                }
                type="search"
                placeholder="Search name or email..."
                className="
                  h-10
                  w-full

                  rounded-xl

                  border
                  border-zinc-200

                  bg-zinc-50

                  pl-9
                  pr-3

                  text-sm
                  text-zinc-950

                  outline-none

                  transition

                  placeholder:text-zinc-400

                  focus:border-zinc-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-zinc-100
                "
              />

            </div>

          </div>


          {/* FILTERS */}

          <div
            className="
              mt-4
              flex
              flex-col
              gap-2

              sm:flex-row
            "
          >

            <select
              value={
                roleFilter
              }
              onChange={(
                event
              ) =>
                setRoleFilter(
                  event.target
                    .value as RoleFilter
                )
              }
              className="
                h-10

                rounded-xl

                border
                border-zinc-200

                bg-white

                px-3

                text-xs
                font-medium
                text-zinc-700

                outline-none

                focus:border-zinc-400
              "
            >

              <option value="ALL">
                All roles
              </option>

              <option value="TREASURER">
                Treasurer
              </option>

              <option value="FRIEND">
                Friend
              </option>

            </select>


            <select
              value={
                verificationFilter
              }
              onChange={(
                event
              ) =>
                setVerificationFilter(
                  event.target
                    .value as VerificationFilter
                )
              }
              className="
                h-10

                rounded-xl

                border
                border-zinc-200

                bg-white

                px-3

                text-xs
                font-medium
                text-zinc-700

                outline-none

                focus:border-zinc-400
              "
            >

              <option value="ALL">
                All verification
              </option>

              <option value="VERIFIED">
                Verified
              </option>

              <option value="PENDING">
                Pending
              </option>

            </select>


            <div
              className="
                flex
                h-10
                items-center

                rounded-xl

                bg-zinc-50

                px-3

                text-xs
                text-zinc-500
              "
            >
              {filteredUsers.length} result{filteredUsers.length === 1 ? "" : "s"}
            </div>

          </div>

        </div>


        {/* =========================
            DESKTOP TABLE
        ========================= */}

        <div
          className="
            hidden
            overflow-visible

            md:block
          "
        >

          <table
            className="
              w-full
              border-collapse
              text-left
            "
          >

            <thead>

              <tr
                className="
                  border-b
                  border-zinc-100

                  text-[11px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-zinc-400
                "
              >

                <th className="px-6 py-3">
                  User
                </th>

                <th className="px-4 py-3">
                  Role
                </th>

                <th className="px-4 py-3">
                  Verification
                </th>

                <th className="px-4 py-3">
                  Joined
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-right
                  "
                >
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredUsers.map(
                (user) => {

                  const initial =
                    user.name
                      .trim()
                      .charAt(0)
                      .toUpperCase() ||
                    user.email
                      .charAt(0)
                      .toUpperCase();


                  const currentUser =
                    user.id ===
                    currentUserId;


                  return (

                    <tr
                      key={
                        user.id
                      }
                      className="
                        border-b
                        border-zinc-100

                        last:border-b-0

                        transition

                        hover:bg-zinc-50/60
                      "
                    >

                      {/* USER */}

                      <td
                        className="
                          px-6
                          py-4
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center

                              rounded-xl

                              bg-violet-50

                              text-xs
                              font-semibold
                              text-violet-700
                            "
                          >
                            {initial}
                          </div>


                          <div
                            className="
                              min-w-0
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-medium
                                  text-zinc-900
                                "
                              >
                                {user.name ||
                                  "Unnamed User"}
                              </p>


                              {currentUser && (
                                <span
                                  className="
                                    rounded-full
                                    bg-zinc-100
                                    px-2
                                    py-0.5

                                    text-[10px]
                                    font-medium
                                    text-zinc-500
                                  "
                                >
                                  You
                                </span>
                              )}

                            </div>


                            <p
                              className="
                                mt-0.5
                                truncate
                                text-xs
                                text-zinc-500
                              "
                            >
                              {user.email}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* ROLE */}

                      <td className="px-4 py-4">

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1

                            text-[11px]
                            font-medium

                            ${
                              user.role ===
                              "TREASURER"
                                ? "bg-zinc-950 text-white"
                                : "bg-zinc-100 text-zinc-600"
                            }
                          `}
                        >

                          {user.role ===
                          "TREASURER"
                            ? "Treasurer"
                            : "Friend"}

                        </span>

                      </td>


                      {/* VERIFIED */}

                      <td className="px-4 py-4">

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1

                            text-[11px]
                            font-medium

                            ${
                              user.emailVerified
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }
                          `}
                        >

                          {user.emailVerified
                            ? "Verified"
                            : "Pending"}

                        </span>

                      </td>


                      {/* JOINED */}

                      <td
                        className="
                          whitespace-nowrap
                          px-4
                          py-4

                          text-xs
                          text-zinc-500
                        "
                      >
                        {formatDate(
                          user.createdAt
                        )}
                      </td>


                      {/* ACTION */}

                      <td
                        className="
                          relative
                          px-6
                          py-4
                          text-right
                        "
                      >

                        <div
                          data-user-menu
                          className="
                            relative
                            inline-block
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId ===
                                  user.id
                                  ? null
                                  : user.id
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center

                              rounded-xl

                              text-zinc-400

                              transition

                              hover:bg-zinc-100
                              hover:text-zinc-800
                            "
                            aria-label={`Actions for ${user.name}`}
                          >

                            <MoreHorizontal
                              size={18}
                            />

                          </button>


                          {openMenuId ===
                            user.id && (

                            <div
                              className="
                                absolute
                                right-0
                                top-11
                                z-50

                                w-48

                                overflow-hidden

                                rounded-xl

                                border
                                border-zinc-200

                                bg-white

                                p-1.5

                                text-left

                                shadow-xl
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  openDetails(
                                    user
                                  )
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-2

                                  rounded-lg

                                  px-3
                                  py-2

                                  text-xs
                                  font-medium
                                  text-zinc-700

                                  transition

                                  hover:bg-zinc-50
                                "
                              >

                                <Eye
                                  size={15}
                                />

                                View details

                              </button>


                              {!currentUser && (
                                <>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openRoleModal(
                                        user
                                      )
                                    }
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-2

                                      rounded-lg

                                      px-3
                                      py-2

                                      text-xs
                                      font-medium
                                      text-zinc-700

                                      transition

                                      hover:bg-zinc-50
                                    "
                                  >

                                    <UserCog
                                      size={15}
                                    />

                                    Change role

                                  </button>


                                  <div
                                    className="
                                      my-1
                                      border-t
                                      border-zinc-100
                                    "
                                  />


                                  <button
                                    type="button"
                                    onClick={() =>
                                      openDeleteModal(
                                        user
                                      )
                                    }
                                    className="
                                      flex
                                      w-full
                                      items-center
                                      gap-2

                                      rounded-lg

                                      px-3
                                      py-2

                                      text-xs
                                      font-medium
                                      text-red-600

                                      transition

                                      hover:bg-red-50
                                    "
                                  >

                                    <Trash2
                                      size={15}
                                    />

                                    Delete account

                                  </button>

                                </>
                              )}


                              {currentUser && (

                                <div
                                  className="
                                    px-3
                                    py-2

                                    text-[10px]
                                    leading-4
                                    text-zinc-400
                                  "
                                >
                                  Your active Treasurer account is protected.
                                </div>

                              )}

                            </div>

                          )}

                        </div>

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>


        {/* =========================
            MOBILE
        ========================= */}

        <div
          className="
            divide-y
            divide-zinc-100

            md:hidden
          "
        >

          {filteredUsers.map(
            (user) => {

              const currentUser =
                user.id ===
                currentUserId;


              const initial =
                user.name
                  .trim()
                  .charAt(0)
                  .toUpperCase() ||
                user.email
                  .charAt(0)
                  .toUpperCase();


              return (

                <div
                  key={
                    user.id
                  }
                  className="
                    px-5
                    py-4
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center

                        rounded-xl

                        bg-violet-50

                        text-xs
                        font-semibold
                        text-violet-700
                      "
                    >
                      {initial}
                    </div>


                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >

                        <div
                          className="
                            min-w-0
                          "
                        >

                          <p
                            className="
                              truncate
                              text-sm
                              font-medium
                              text-zinc-950
                            "
                          >
                            {user.name}
                          </p>


                          <p
                            className="
                              mt-0.5
                              truncate
                              text-xs
                              text-zinc-500
                            "
                          >
                            {user.email}
                          </p>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            openDetails(
                              user
                            )
                          }
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center

                            rounded-lg

                            bg-zinc-50
                            text-zinc-500
                          "
                        >
                          <Eye
                            size={15}
                          />
                        </button>

                      </div>


                      <div
                        className="
                          mt-3
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >

                        <span
                          className={`
                            rounded-full
                            px-2.5
                            py-1

                            text-[10px]
                            font-medium

                            ${
                              user.role ===
                              "TREASURER"
                                ? "bg-zinc-950 text-white"
                                : "bg-zinc-100 text-zinc-600"
                            }
                          `}
                        >
                          {user.role ===
                          "TREASURER"
                            ? "Treasurer"
                            : "Friend"}
                        </span>


                        <span
                          className={`
                            rounded-full
                            px-2.5
                            py-1

                            text-[10px]
                            font-medium

                            ${
                              user.emailVerified
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }
                          `}
                        >
                          {user.emailVerified
                            ? "Verified"
                            : "Pending"}
                        </span>


                        {currentUser && (
                          <span
                            className="
                              rounded-full
                              bg-violet-50
                              px-2.5
                              py-1

                              text-[10px]
                              font-medium
                              text-violet-700
                            "
                          >
                            You
                          </span>
                        )}

                      </div>


                      {!currentUser && (

                        <div
                          className="
                            mt-3
                            flex
                            gap-2
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              openRoleModal(
                                user
                              )
                            }
                            className="
                              rounded-lg
                              border
                              border-zinc-200

                              px-2.5
                              py-1.5

                              text-[10px]
                              font-medium
                              text-zinc-600
                            "
                          >
                            Change role
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(
                                user
                              )
                            }
                            className="
                              rounded-lg
                              bg-red-50

                              px-2.5
                              py-1.5

                              text-[10px]
                              font-medium
                              text-red-600
                            "
                          >
                            Delete
                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                </div>

              );

            }
          )}


          {filteredUsers.length ===
            0 && (

            <div
              className="
                px-5
                py-12
                text-center
              "
            >

              <UsersRound
                size={25}
                className="
                  mx-auto
                  text-zinc-300
                "
              />


              <p
                className="
                  mt-3
                  text-sm
                  font-medium
                  text-zinc-700
                "
              >
                No users found
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  text-zinc-400
                "
              >
                Try changing your search or filters.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* =========================
          USER DETAILS
      ========================= */}

      <Modal
        open={
          modalView ===
          "details"
        }
        onClose={
          closeModal
        }
        title="User details"
        description="Account information and access."
      >

        {selectedUser && (

          <div>

            <div
              className="
                flex
                items-center
                gap-3

                rounded-2xl

                bg-zinc-50

                p-4
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center

                  rounded-xl

                  bg-violet-100

                  font-semibold
                  text-violet-700
                "
              >
                {selectedUser.name
                  .charAt(0)
                  .toUpperCase()}
              </div>


              <div
                className="
                  min-w-0
                "
              >

                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-zinc-950
                  "
                >
                  {selectedUser.name}
                </p>


                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    text-zinc-500
                  "
                >
                  {selectedUser.email}
                </p>

              </div>

            </div>


            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-3
              "
            >

              <div
                className="
                  rounded-xl
                  border
                  border-zinc-100
                  p-3
                "
              >
                <p className="text-[10px] uppercase tracking-wide text-zinc-400">
                  Role
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-800">
                  {selectedUser.role ===
                  "TREASURER"
                    ? "Treasurer"
                    : "Friend"}
                </p>
              </div>


              <div
                className="
                  rounded-xl
                  border
                  border-zinc-100
                  p-3
                "
              >
                <p className="text-[10px] uppercase tracking-wide text-zinc-400">
                  Verification
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-800">
                  {selectedUser.emailVerified
                    ? "Verified"
                    : "Pending"}
                </p>
              </div>


              <div
                className="
                  col-span-2
                  rounded-xl
                  border
                  border-zinc-100
                  p-3
                "
              >
                <p className="text-[10px] uppercase tracking-wide text-zinc-400">
                  Joined
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-800">
                  {formatDate(
                    selectedUser.createdAt
                  )}
                </p>
              </div>

            </div>


            {selectedUser.id !==
              currentUserId && (

              <button
                type="button"
                onClick={() =>
                  openRoleModal(
                    selectedUser
                  )
                }
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-zinc-950

                  px-4
                  py-3

                  text-sm
                  font-medium
                  text-white

                  transition

                  hover:bg-zinc-800
                "
              >

                <UserCog
                  size={16}
                />

                Manage Role

              </button>

            )}

          </div>

        )}

      </Modal>


      {/* =========================
          CHANGE ROLE
      ========================= */}

      <Modal
        open={
          modalView ===
          "role"
        }
        onClose={
          closeModal
        }
        title="Change user role"
        description="Control what this account can access."
      >

        {selectedUser && (

          <div>

            <div
              className="
                rounded-xl
                bg-zinc-50
                px-4
                py-3
              "
            >

              <p className="text-sm font-medium text-zinc-900">
                {selectedUser.name}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {selectedUser.email}
              </p>

            </div>


            <label
              className="
                mt-5
                block
                text-xs
                font-semibold
                text-zinc-600
              "
            >
              Role
            </label>


            <select
              value={
                roleDraft
              }
              onChange={(
                event
              ) =>
                setRoleDraft(
                  event.target
                    .value as
                    | "TREASURER"
                    | "FRIEND"
                )
              }
              className="
                mt-2
                w-full

                rounded-xl

                border
                border-zinc-200

                bg-white

                px-3.5
                py-3

                text-sm
                text-zinc-950

                outline-none

                focus:border-zinc-400
                focus:ring-4
                focus:ring-zinc-100
              "
            >

              <option value="FRIEND">
                Friend — view only
              </option>

              <option value="TREASURER">
                Treasurer — full management
              </option>

            </select>


            <div
              className="
                mt-4
                rounded-xl
                bg-amber-50
                px-3
                py-3
              "
            >

              <div
                className="
                  flex
                  gap-2
                "
              >

                <ShieldCheck
                  size={15}
                  className="
                    mt-0.5
                    shrink-0
                    text-amber-700
                  "
                />


                <p
                  className="
                    text-xs
                    leading-5
                    text-amber-800
                  "
                >
                  Treasurer accounts can modify trip data, expenses, contributions and users.
                </p>

              </div>

            </div>


            {error && (
              <p
                className="
                  mt-3
                  rounded-xl
                  bg-red-50
                  px-3
                  py-2

                  text-xs
                  text-red-700
                "
              >
                {error}
              </p>
            )}


            <div
              className="
                mt-5
                flex
                gap-2
              "
            >

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  loading
                }
                className="
                  flex-1

                  rounded-xl

                  border
                  border-zinc-200

                  px-4
                  py-3

                  text-sm
                  font-medium
                  text-zinc-700

                  hover:bg-zinc-50

                  disabled:opacity-50
                "
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleRoleChange
                }
                disabled={
                  loading ||
                  roleDraft ===
                    selectedUser.role
                }
                className="
                  flex-1

                  rounded-xl

                  bg-zinc-950

                  px-4
                  py-3

                  text-sm
                  font-medium
                  text-white

                  hover:bg-zinc-800

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >

                {loading
                  ? "Saving..."
                  : "Save Role"}

              </button>

            </div>

          </div>

        )}

      </Modal>


      {/* =========================
          DELETE ACCOUNT
      ========================= */}

      <Modal
        open={
          modalView ===
          "delete"
        }
        onClose={
          closeModal
        }
        title="Delete account"
        description="This action permanently removes the account."
      >

        {selectedUser && (

          <div>

            <div
              className="
                rounded-xl
                border
                border-red-100
                bg-red-50
                p-4
              "
            >

              <div
                className="
                  flex
                  gap-3
                "
              >

                <Trash2
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-red-600
                  "
                />


                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-red-900
                    "
                  >
                    Delete {selectedUser.name}?
                  </p>


                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-red-700
                    "
                  >
                    Their login account and authentication sessions will be permanently removed.
                  </p>

                </div>

              </div>

            </div>


            <label
              className="
                mt-5
                block
                text-xs
                font-semibold
                text-zinc-600
              "
            >
              Type{" "}
              <span className="font-bold text-zinc-950">
                {selectedUser.name}
              </span>{" "}
              to confirm
            </label>


            <input
              value={
                deleteConfirmation
              }
              onChange={(
                event
              ) =>
                setDeleteConfirmation(
                  event.target
                    .value
                )
              }
              className="
                mt-2
                w-full

                rounded-xl

                border
                border-zinc-200

                px-3.5
                py-3

                text-sm

                outline-none

                focus:border-red-300
                focus:ring-4
                focus:ring-red-50
              "
            />


            {error && (
              <p
                className="
                  mt-3
                  rounded-xl
                  bg-red-50
                  px-3
                  py-2

                  text-xs
                  text-red-700
                "
              >
                {error}
              </p>
            )}


            <div
              className="
                mt-5
                flex
                gap-2
              "
            >

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  loading
                }
                className="
                  flex-1

                  rounded-xl

                  border
                  border-zinc-200

                  px-4
                  py-3

                  text-sm
                  font-medium
                  text-zinc-700
                "
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleDelete
                }
                disabled={
                  loading ||
                  deleteConfirmation !==
                    selectedUser.name
                }
                className="
                  flex-1

                  rounded-xl

                  bg-red-600

                  px-4
                  py-3

                  text-sm
                  font-medium
                  text-white

                  transition

                  hover:bg-red-700

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >

                {loading
                  ? "Deleting..."
                  : "Delete Account"}

              </button>

            </div>

          </div>

        )}

      </Modal>

    </>
  );
}