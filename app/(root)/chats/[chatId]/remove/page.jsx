"use client";

import Loader from "@components/Loader";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";

const Remove = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [chat, setChat] = useState({});
  const [unselected , setUnselected] = useState([]);

  const { chatId } = useParams();

  const { data: session } = useSession();
  const currentUser = session?.user;

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setChat(data);
      setUnselected(data.members);
      setLoading(false);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);

  /* SELECT CONTACT */
  const [selectedContacts, setSelectedContacts] = useState([]);
  

  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }

    if (unselected.includes(contact)) {
      setUnselected((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      );
    } else {
      setUnselected((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
    
  };

  const router = useRouter();

  const updateGroup = async () => {
    setLoading(true);
    const data={members: unselected};
    try {
      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);

      if (res.ok) {
        router.push(`/chats/${chatId}`);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="create-chat-container">
      <input
        placeholder="Search contact..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="contact-bar">
        <div className="contact-list">
          <p className="text-body-bold">Select or Deselect</p>

          <div className="flex flex-col flex-1 gap-5 overflow-y-scroll custom-scrollbar">
            {chat?.members?.map((member, index)=> (
              <div
                onClick={() => handleSelect(member)}
              >
                
                {member._id === currentUser._id ? <></> :
                <div key={index}
                className="contact">
                    {selectedContacts.find((item) => item === member) ? (
                    <CheckCircle sx={{ color: "red" }} />
                  ) : (
                    <RadioButtonUnchecked />
                  )}
                    <img
                    src={member.profileImage || "/assets/person.jpg"}
                    alt="profile"
                    className="profilePhoto"
                    />
                    <p className="text-base-bold">{member.username}</p>
                </div>
                }
              </div>
            ))}
          </div>
        </div>

        <div className="create-chat">
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Members</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact, index) => (
                    <p className="selected-contact" key={index}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
          <button
            className="btn"
            onClick={updateGroup}
            disabled={selectedContacts.length == 0}
          >
            Remove Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default Remove;
