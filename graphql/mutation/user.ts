export const followUserMutation=`
    mutation FollowUser($to: ID!) {
        followUser(to: $to)
}
`


export const unfollowUserMutation=`
    mutation UnfollowUser($to: ID!) {
        unfollowUser(to: $to)
}
`