import Image from 'next/image'
import React from 'react'

import { BiMessageRounded } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineUpload } from "react-icons/ai";
import { Tweet } from '@/gpl/graphql';
import Link from 'next/link';

interface FeedCardProps{
    data: Tweet 
}

const FeedCard:React.FC<FeedCardProps>=(props)=>{
    const {data}=props
    return (
        <div className=' border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer '>
            <div className='grid grid-cols-12 gap-3'>
                <div className='col-span-1'>
                    {typeof data.author?.profileImageURL==="string" && 
                    <Image className='rounded-full' src={data.author.profileImageURL} alt='user-profile-image' width={80} height={80}/>}
                </div>
                <div className='col-span-11 ml-2'>
                    <h5>
                        <Link href={`/${data.author?.id}`}>
                            {data.author?.firstName} {data.author?.lastName}
                        </Link>
                    </h5>
                    <p>{typeof data.content==="string" && data.content}</p>
                    { typeof data.imageURL==="string" &&
                        data.imageURL && <Image src={data.imageURL} alt='image-url' width={300} height={300}></Image>
                    }
                    <div className='flex justify-between p-2 mt-5 text-xl items-center w-[90%]'>
                        <div>
                            <BiMessageRounded />
                        </div>
                        <div>
                            <FaRetweet />
                        </div>
                        <div>
                            <FaRegHeart />
                        </div>
                        <div>
                            <AiOutlineUpload />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedCard
