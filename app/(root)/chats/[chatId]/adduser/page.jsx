'use client'

import React from 'react'
import Loader from "@components/Loader";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CheckCircle, Group, RadioButtonUnchecked } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";

const AddUser = () => {
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [chat, setChat] = useState({});
    const [grupMember, setGrupmember] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [leftMember, setleftMember] = useState([]);
    const [isLeft , setIsLeft] =useState(true);

    const { chatId } = useParams();

    const { data: session } = useSession();
    const currentUser = session?.user;

    const getChatDetails = async () => {
        try {
            const res = await fetch(`/api/chats/${chatId}`);
            const data = await res.json();

            const res1 = await fetch(
                search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
              );
              const data1 = await res1.json();

            setChat(data);
            setGrupmember(data.members);
            setAllUser(data1);

            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    };

    const getContacts = async (grupmembers) => {
        try {
          const res = await fetch(
            search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
          );
          const data = await res.json();
         
          
          setAllUser(data);
          
        } catch (err) {
          console.log(err);
        }
      };

    useEffect(() => {
        if (chatId) {
            getChatDetails();
            
        }
    }, [chatId]);


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
    
  };

  function handleLeftUser(){
    setIsLeft(false);
    let leftUser=[]
    for (let i = 0; i < allUser.length; i++) {
        let f=true;
        for (let j=0 ; j < grupMember.length; j++){
            if(allUser[i]._id == grupMember[j]._id){
                f=false;
            }
        }
        if(f){
            leftUser.push(allUser[i]);
        }
    }

    setleftMember(leftUser);
  }

  const router = useRouter();

  const updateUser = async()=>{

    selectedContacts.map( async (contact,index)=>{
      let group=contact.chats;
      group.push(chatId);
      const data = {chats: group};
      let userId=contact._id;
      // console.log(userId);
      try{
        const res2 = await fetch(`/api/users/${userId}/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
      }catch(err){
        console.log(err);
      }
    })
  }

  const updateGroup = async () => {
    Array.prototype.push.apply(selectedContacts,grupMember); 
    setLoading(true);
    await updateUser();
    const data = {members: selectedContacts};
    
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
        {isLeft ? handleLeftUser() :<></>}
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
                        {leftMember.map((member, index) => (
                            <div onClick={() => handleSelect(member)}>

                                {member._id === currentUser._id   ? <></> :
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
                            {grupMember.map((contact, index) => (
                                <p className="selected-contact" key={index}>
                                    {contact.username}
                                </p>
                            ))}
                        </div>
                    </div>
                    <button
                        className="btn"
                        onClick={updateGroup}
                        disabled={allUser.length == 0}
                    >
                        Add Members
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddUser