'use client';

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Search } from "lucide-react";
import AddMemberForm from "./addMemberForm";
import { useParams } from "next/navigation";
import EditMemberDialog from "./editMemberDialog";
import DeleteMemberDialog from "./deleteMemberDialog";
import { Toaster } from "react-hot-toast";
import { getEventMembers } from "@/services/org.service";
import { EventMember } from "@/types/models/org/member.interface";
import { useTranslations } from "next-intl";

const MemberTable = () => {
  const t = useTranslations("common");
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return msg.startsWith("common.") ? fallback : msg;
  };

  const params = useParams();
  const eventId = parseInt(params?.id?.toString() || "");
  const [search, setSearch] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<EventMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<EventMember | null>(null);
  const [members, setMembers] = useState<EventMember[]>([]);

  const fetchMembers = async (emailFilter = "") => {
    try {
      if (!eventId) return;
      const members = await getEventMembers(Number(eventId), emailFilter);
      setMembers(members);
    } catch (error) {
      console.error("Error fetching event members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [eventId]);

  const filteredMembers = members.filter((member) =>
    member.email.toLowerCase().includes(search.toLowerCase()) ||
    member.role_desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex justify-between items-center">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-1/3 bg-white">
          <input
            type="text"
            className="w-full px-3 py-2 outline-none"
            placeholder={transWithFallback("searchByName", "Tìm kiếm theo tên")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]">
            <Search size={24} color="white" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-[#48D1CC] text-[#0C4762] rounded-md transition duration-200 hover:bg-[#51DACF]"
            onClick={() => setIsAddingMember(true)}
          >
            {transWithFallback("addMember", "Thêm thành viên")}
          </button>
        </div>
        {isAddingMember && (
          <AddMemberForm
            eventId={eventId}
            onClose={() => setIsAddingMember(false)}
            onSuccess={fetchMembers}
          />
        )}
      </div>

      <table className="w-full border border-gray-300 shadow-lg mt-6">
        <thead>
          <tr className="bg-[#0C4762] text-white">
            <th className="border px-4 py-2 text-left">{transWithFallback("member", "Thành viên")}</th>
            <th className="border px-4 py-2 text-left">{transWithFallback("role", "Vai trò")}</th>
            <th className="border px-2 py-2 text-center w-20">{transWithFallback("actions", "Thao tác")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member, index) => {
            const isOrganizer = member.role_desc.toLowerCase() === 'organizer';
            return (
              <tr key={index}>
                <td className="border px-4 py-2">{member.email}</td>
                <td className="border px-4 py-2">{member.role_desc}</td>
                <td className="border px-2 py-2 text-center w-40">
                  <button
                    onClick={() => !isOrganizer && setEditingMember(member)}
                    className={`mx-1 ${isOrganizer ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700'}`}
                    disabled={isOrganizer}
                    title={isOrganizer ? transWithFallback("cannotEditOrganizer", "Không thể sửa vai trò của chủ sự kiện") : transWithFallback("editMember", "Sửa thành viên")}
                  >
                    <FaEdit />
                  </button>

                  {editingMember?.email === member.email && (
                    <EditMemberDialog
                      eventId={eventId}
                      member={editingMember}
                      onClose={() => setEditingMember(null)}
                      onSuccess={fetchMembers}
                    />
                  )}

                  <button
                    onClick={() => !isOrganizer && setDeletingMember(member)}
                    className={`mx-1 ${isOrganizer ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                    disabled={isOrganizer}
                    title={isOrganizer ? transWithFallback("cannotDeleteOrganizer", "Không thể xóa chủ sự kiện") : transWithFallback("deleteMember", "Xóa thành viên")}
                  >
                    <FaTrash />
                  </button>

                  {deletingMember?.email === member.email && (
                    <DeleteMemberDialog
                      eventId={eventId}
                      email={deletingMember.email}
                      onClose={() => setDeletingMember(null)}
                      onSuccess={fetchMembers}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
