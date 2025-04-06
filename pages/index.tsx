import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { userCurrentUser } from "@/hooks/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CredentialResponse } from "@react-oauth/google";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import TwitterLayout from "@/components/FeedCard/Layout/TwitterLayout";
import { CiImageOn } from "react-icons/ci";
import FeedCard from "@/components/FeedCard";
import toast from "react-hot-toast";
import { GetServerSideProps } from "next";
import { Tweet, User } from "@/gpl/graphql";
import { getAllTweetsQuery, getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import axios from "axios";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface HomeProps{
  tweets?: Tweet[]
}


// type Tweet = {
//   id: string;
//   content: string;
//   imageURL?: string;
//   author: {
//       id: string;
//       firstName: string;
//       lastName: string;
//       profileImageURL?: string;
//   };
// };

// type GetAllTweetsResponse = {
//   getAllTweets: Tweet[];
// };

// interface HomeProps {
//   tweets: Tweet[];
// }

type GetSignedURLForTweetResponse = {
  getSignedURLForTweet: string; // Replace `string` with the actual type if it's more complex
};

export default function Home(props: HomeProps) {

  const {user}=userCurrentUser()
  // const {tweets = []}=useGetAllTweets()
  const {mutateAsync}=useCreateTweet()
  const {tweets =props.tweets as Tweet[]}=useGetAllTweets()


  const [content,setContent]=useState('')
  const [imageURL,setImageURL]=useState('')

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

  //Below Handel the image input
  const handleInputChangeFile=useCallback((input: HTMLInputElement)=>{
    return async(event: Event)=>{
      event.preventDefault()
      const file: File | null | undefined =input.files?.item(0)

      if(!file) return

      const {getSignedURLForTweet}=await graphqlClient.request<GetSignedURLForTweetResponse>(getSignedURLForTweetQuery,{
        imageName: file.name,
        imageType: file.type
      })

      if(getSignedURLForTweet){
        toast.loading("Uploading Image", {id:"1"})
        await axios.put(getSignedURLForTweet, file, {
          headers:{
            "Content-Type": file.type
          }
        })
        toast.success("Uploading Image", {id:"1"})
        const url=new URL(getSignedURLForTweet)
        const myFilePath=`${url.origin}${url.pathname}`
        setImageURL(myFilePath)
      }
    }
  },[])

  const handleSelectImage=useCallback(
    () => {
      const input=document.createElement('input')
      input.setAttribute("type","file")
      input.setAttribute("accept","image/*")
      input.addEventListener("change",handleInputChangeFile(input))
      input.click()
    },
    [handleInputChangeFile],
  );

  const handleCreateTweet=useCallback(async () => {
      await mutateAsync({
        content,
        imageURL
      })
      setContent("")
      setImageURL("")
    },
    [content,mutateAsync,imageURL],
  );

  return (
    <div>
     <TwitterLayout>
     <div className="col-span-5 border-r-[1px] border-l-[1px] border-gray-600 ">
          <div>
          <div className=' border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer'>
          <div className='grid grid-cols-12 gap-3'>
            <div className='col-span-1'>
              {user?.profileImageURL && 
              <Image className="rounded-full" src={user?.profileImageURL} 
              alt='user-profile-image' width={80} height={80}/>}
            </div>
            <div className="col-span-11">
                <textarea value={content}
                onChange={e=>setContent(e.target.value)}
                className="w-full bg-transparent text-xl px-3 border-b border-slate-700" placeholder="Whats Happening?" rows={3}>
                </textarea>
                {imageURL && <Image src={imageURL} alt='image-url' height={300} width={300}></Image>}
                <div className="mt-2 flex justify-between items-center">
                <CiImageOn onClick={handleSelectImage} className="text-xl"/>
                <button onClick={handleCreateTweet} className="bg-[#D7DBDC] text-black font-semibold text-sm py-2 px-4 rounded-full">Post</button>
                </div>
            </div>
          </div>
          </div>
          </div>
          {
          tweets && typeof tweets==="object" && Array.isArray(tweets) &&
            tweets?.map((tweet) => tweet ? <FeedCard  data={tweet}></FeedCard> : null)
            }  
            {/* remove key from above line= key={tweet?.id} */}
      </div>
     </TwitterLayout>
    </div>
  );
}



type TweetResponse = {
  id: string;
  content: string;
  imageURL?: string;
  author: {
      id: string;
      firstName: string;
      lastName: string;
      profileImageURL?: string;
  };
};

type GetAllTweetsResponse = {
  getAllTweets: Tweet[];
};

// interface HomeProps {
//   tweets?: Tweet[];
// }


export const getServerSideProps:GetServerSideProps<HomeProps>=async(context)=>{
  const allTweets=await graphqlClient.request<GetAllTweetsResponse>(getAllTweetsQuery)

  return {
    props:{
      tweets: allTweets.getAllTweets 
    }
  }
}