import styled from "styled-components";
import Entry from "./entry";
import Input from "@Components/Input";
import Button from "@Components/Button";
import Icon from "@Components/Icon";
import { useEffect, useState } from "react";
import { useContentTransition } from "@Components/Transition";
import Widgets from "./widgets";

export default function Posts({gameData, feedData}){

    const transition = useContentTransition();
    const posts = feedData?.posts || [];
    const [newPost, setNewPost] = useState("");
    const [openPost, setOpenPost] = useState(null);
    const isGrid = true;
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [openPost])

    const changePost = (post) => {
        transition(() => {
            setOpenPost(post);
        })
    }

    const fkComment = {
        id: "2093I",
        type: "comment",
        title: "Comment",
        description: "This is a comment",
        date: "2021-05-20",
        image: null,
        sender: {
            username: "Unknown player",
            avatar: null,
        },
    };

    let content = null;
    if(openPost) {
        content = <>
            <PostsContainer>
                <Entry
                    open={true}
                    id={openPost.id}
                    type={openPost.type}
                    title={openPost.title}
                    description={openPost.description}
                    date={openPost.date}
                    image={openPost.image}
                    sender={openPost.sender}
                    height={"max-content"}
                    action={() => {changePost(null)}}
                />
                {Array(5).fill(0).map((_, i) =>
                    <Entry
                        key={i}
                        id={fkComment.id+i}
                        type={fkComment.type}
                        title={fkComment.title}
                        description={fkComment.description}
                        date={fkComment.date}
                        image={fkComment.image}
                        sender={fkComment.sender}
                        height={"calc(var(--decade) * 15)"}
                        action={() => {}}
                    />
                )}
            </PostsContainer>
        </>
    } else {    
        content = <>
            <Special>
                <Entry
                    id={posts?.[0]?.id}
                    special={true}
                    type={posts?.[0]?.type}
                    title={posts?.[0]?.title}
                    description={posts?.[0]?.description}
                    date={posts?.[0]?.date}
                    image={posts?.[0]?.image}
                    sender={posts?.[0]?.sender}
                    height={"calc(var(--decade) * 10)"}
                    action={() => {}}
                >
                    <></>
                </Entry>
            </Special>
            <Header>
                <NewPost>
                    <Input
                        placeholder="Say something!"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                    />
                    <Button
                        onClick={() => {
                            // window.app.Services.Feed.newPost(gameData, newPost);
                            setNewPost("");
                        }}
                    >
                        <Icon name="arrow-right" />
                    </Button>
                </NewPost>
                <Filter>
                    <Dropdown
                        onClick={() => isGrid ? null : isGrid}
                    >
                        <div>Mix</div>
                        {/* <Icon name="arrow-right" /> */}
                    </Dropdown>
                </Filter>
            </Header>
            <PostsContainer
                $isGrid={isGrid}
            >
                {
                    !posts?.length ? <h2>No data available yet</h2> :
                    posts.map((post: any, i: number) => 
                        <Entry
                            type={post.type}
                            key={i}
                            id={post.id}
                            title={post.title}
                            description={post.description}
                            date={post.date}
                            image={post.image}
                            sender={post.sender}
                            height={isGrid ? "100%" : null}
                            action={() => {changePost(post)}}
                        />
                    )
                }
            </PostsContainer>
        </>
    }

    return (
        <>
            <PostsPage>
                { content }
            </PostsPage>
            <Widgets gameData={gameData} feedData={feedData}/>
        </>
    )
}

const Special = styled.div`
    width: 100%;
    height: max-content;
    margin-bottom: calc(var(--quintet) * 2.5);
`;

const Dropdown = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: var(--quintet);
    align-items: center;
    cursor: pointer;
    height: calc(var(--decade) * 4);
    font-weight: 600;

`;

// & > *:last-child {
//     transform: rotate(90deg);
//     height: 60%;
// }
const Header = styled.div`
    width: 100%;
    height: max-content;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--decade);
`;

const Filter = styled.div`
    cursor: pointer;
    width: 8%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius);
    padding: calc(var(--decade) * 1) calc(var(--decade) * 2);
    box-sizing: border-box;
`;

const NewPost = styled.div`
    width: 100%;
    height: max-content;
    display: flex;
    padding: calc(var(--decade) * 1);
    gap: calc(var(--quintet) * 1);
    box-sizing: border-box;
    border-radius: var(--radius);
    background-color: rgba(255, 255, 255, 0.1);
    flex: 1;

    & > *:last-child {
        aspect-ratio: 1/1;
        width: revert;
    }
`;

const PostsContainer = styled.div`
    width: 100%;
    height: max-content;
    display: ${(props: any) => props.$isGrid ? "grid" : "flex"};
    flex-direction: column;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: calc(var(--decade) * 20);
    margin-top: calc(var(--quintet) * 2.5) ;
    gap: calc(var(--quintet) * 2.5) ;
`;

const PostsPage = styled.div`
    flex: 1 0 0;    
    margin-top: calc(var(--quintet) * 2.5) ;
    width: 100%;
    height: max-content;
`;