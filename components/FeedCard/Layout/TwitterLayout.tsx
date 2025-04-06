"use client";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from 'react'
import { BiMessageCheck } from 'react-icons/bi'
import { BsTwitter } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { FaRegUser } from 'react-icons/fa'
import { GoHome } from 'react-icons/go'
import { IoSearchOutline } from 'react-icons/io5'
import { MdOutlineWorkspacePremium } from 'react-icons/md'
import { PiBookmarkSimple } from 'react-icons/pi'
import { RiNotificationLine } from 'react-icons/ri'
import { userCurrentUser } from '@/hooks/user'
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface TwitterLayoutProps{
    children: React.ReactNode
}

interface TwitterSidebarButton{
  title: string;
  icon: React.ReactNode;
  link: string
}




const TwitterLayout: React.FC<TwitterLayoutProps> =(props) => {
    const {user}=userCurrentUser()
    // const {tweets = []}=useGetAllTweets()

    const sideBarMenuItems: TwitterSidebarButton[] = useMemo(
        () => [
            {
              title:"Home",
              icon: <GoHome />,
              link: "/"
            },
            {
              title: "Explore",
              icon: <IoSearchOutline />,
              link: "/"
            },
            {
              title:"Notification",
              icon: <RiNotificationLine />,
              link: "/"
            },
            {
              title:"Messages",
              icon:<BiMessageCheck />,
              link: "/"
            },{
              title:"Bookmarks",
              icon: <PiBookmarkSimple />,
              link: "/"
            },
            {
              title:"Profile",
              icon: <FaRegUser />,
              link: `/${user?.id}`
            },
            {
              title: "Premium",
              icon: <MdOutlineWorkspacePremium />,
              link: "/"
            },{
              title: "More",
              icon: <CgMoreO />,
              link: "/"
            }
          ],
          [user?.id]
        );

      // const {mutate}=useCreateTweet()
      // const [content,setContent]=useState('')
      const queryClient=useQueryClient()
      const handelLoginWithGoogle=useCallback(async(cred:CredentialResponse)=>{
        console.log('ahc ')
        const googleToken=cred.credential
    
        if(!googleToken){
          return toast.error(`Google token not found`)
        }
    
        const {verifyGoogleToken}=await  graphqlClient.request(verifyUserGoogleTokenQuery,{
          token: googleToken
        })
    
        toast.success("Verified Success")
        console.log('xyz',verifyGoogleToken)
        if(verifyGoogleToken){
          window.localStorage.setItem('__twitter_token',verifyGoogleToken)
        }
        await queryClient.invalidateQueries({ queryKey: ['current-user'] });
      },[queryClient])
    
    //   const handleSelectImage=useCallback(
    //     () => {
    //       const input=document.createElement('input')
    //       input.setAttribute("type","file")
    //       input.setAttribute("accept","image/*")
    //       input.click()
    //     },
    //     [],
    //   );
    
      
  return (
    <div>
        <div className="grid grid-cols-12 h-screen w-screen sm:px-60">
            <div className="col-span-2 sm:col-span-3  pt-1 flex sm:justify-end pr-4 relative">
                <div>
                    <div className="text-2xl hover:bg-gray-800 rounded-full p-4 h-fit w-fit cursor-pointer transition-all ">
                        <BsTwitter/>
                        </div>
                        <div className="mt-1 text-xl font-bold pr-4 ">
                        <ul>
                        {sideBarMenuItems.map(item=>
                        <li key={item.title} className="">
                            <Link href={item.link}
                            className="flex justify-start items-center gap-4 hover:bg-gray-900 rounded-full px-4 py-2 w-fit cursor-pointer transition-all mt-2">
                            <span>{item.icon}</span>
                            <span className="hidden sm:inline">{item.title}</span>
                            </Link>
                        </li>)}
                        </ul>
                        <div className="mt-5">
                            <button className="hidden sm:block bg-[#D7DBDC] text-black p-3 w-full text-sm rounded-full">Post</button>
                        </div>
                        <div className="mt-5">
                            <button className="block sm:hidden bg-[#1b9bf0] text-black py-2 px-4 ml-2 w-full text-sm rounded-full">
                            <BsTwitter/>
                            </button>
                        </div>
                        {user &&
                        <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
                            {user && user.profileImageURL && <Image className="rounded-full" src={user?.profileImageURL} alt="user-image" height={50} width={50}></Image>}
                            <div className="hidden sm:block">
                            <h1 className="text-xl"> {user.firstName} {user.lastName}</h1>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
            <div className="col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600">
                {props.children}
            </div>
        {!user && <div className="col-span-3 p-5">
          <div className="p-5 bg-slate-700 rounded-lg">
            <h1 className="my-2 text-2xl">New to twitter?</h1>
            <GoogleLogin onSuccess={handelLoginWithGoogle}/>
          </div>          
        </div>}

      </div>
      {/* </div> */}
    </div>
  )
}

export default TwitterLayout