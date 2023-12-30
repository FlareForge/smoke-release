import { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import useTransition from "../../Transition";
import ControllerNavigation from "@Components/Controller";

export default () => {
    
    const navigate = useTransition();
    
    const BubbleRef = useRef(null);
    const itemRefs = Array.from({ length: menuItems.length }, ()=>useRef(null));
    
    const [activeItem, setActiveItem] = useState(0);
    
    useEffect(() => {
        window.addEventListener("resize", updateBubble);
        navigate('/library')
        return () => {
            window.removeEventListener("resize", updateBubble);
        };
    }, []);

    useEffect(() => {
        if (activeItem >= 0) updateBubble()
    }, [activeItem]);

    const updateBubble = () => {
        const bubble = BubbleRef.current;
        const { left, width } = getItemTransform();
        bubble.style.width = width;
        bubble.style.left = left;
    }

    const getItemTransform = useCallback(() => {
        const padding = "var(--decade) * 2.3"
        let width = `calc(${itemRefs[activeItem]?.current?.clientWidth || 0}px + ${padding} * 2)`;
        const left = 'calc('+itemRefs.filter((_, i) => i < activeItem).map(item => item?.current?.clientWidth).join("px + ")+`${activeItem > 0 ? 'px + ' : ''}var(--nav-gap) * ${activeItem || 0} - ${padding})`
        return { left, width};
    }, [activeItem]);

    return (
        <ControllerNavigation
            moveToNext={() => setActiveItem((prev) => Math.min(prev + 1, (menuItems.length || 1) - 1))}
            moveToPrev={() => setActiveItem((prev) => Math.max(prev - 1, 0))}
        >
            <BackgroundBubble className="_an_r" ref={BubbleRef}></BackgroundBubble>
            {menuItems.map(({ icon, txt }, i) => {
                const isactive = activeItem === i;
                return (
                    <TransitionLink
                        onClick={() => {
                            setActiveItem(i)
                            navigate(menuItems?.[i]?.link);
                        }}
                        key={`item-menu-${i}`}
                    >
                        <Item
                            $isactive={isactive}
                            ref={itemRefs[i]}
                        >
                            <MenuIcon $isactive={isactive}>
                                {icon}
                            </MenuIcon>
                            <MenuText $txtLength={txt.length}>
                                {txt}
                            </MenuText>
                        </Item>
                    </TransitionLink>
                );
            })}
        </ControllerNavigation>
    );
};

const LinearGradientActiveItems = () => {
    return (
        <>
            <defs>
                <linearGradient
                    id="paint0_linear_115_1229"
                    x1="15"
                    y1="20.5"
                    x2="15"
                    y2="34"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="var(--main)" />
                    <stop offset="1" stopColor="var(--main)" stopOpacity="0" />
                </linearGradient>
            </defs>
        </>
    );
};

const TransitionLink = styled.div`
    cursor: pointer;
`;

const Item = styled.div<{ $isactive: boolean }>`
    color: white;
    font-family: "Montserrat-Medium";
    display: flex;
    justify-content: center;
    align-items: center;
    gap: calc(var(--quintet) * 3);
    position: relative;
    
    ${({ $isactive }) => $isactive === true && `
        font-family: "Montserrat-Black" !important;
        color: var(--main);
    `}
`;

const MenuText = styled.div<{ $txtLength: number }>`
    font-size: calc(var(--quintet) * 2.5) ;
    width: calc(${({ $txtLength }) => $txtLength} * var(--decade) * 0.65);
    white-space: nowrap;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MenuIcon = styled.div<{ $isactive: boolean }>`
    width: calc(var(--decade) * 2);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &::before {
        content: "";
        z-index: -1;
        width: calc(var(--quintet) * 3);
        height: calc(var(--quintet) * 3);
        opacity: 0;
        background: var(--main);
        position: absolute;
        filter: blur(0);
        border-radius: 50%;
        transition: 0.25s linear;
    }

    ${({ $isactive }) => $isactive === true && `
        &::before {
            width: calc(var(--quintet) * 3);
            height: calc(var(--quintet) * 3);
            opacity: 0.25;
            filter: blur(var(--quintet));
        }
    `}

    ${({ $isactive }) => $isactive !== true && `
        & svg{
            & path{
                fill: white;
                opacity: 1;
            }
        }
    `}
`;

const BackgroundBubble = styled.div`
    position: absolute;
    left: 0;
    width: 0;
    height: calc(var(--decade) * 4);
    background: white;
    border-radius: calc(var(--decade) * 5);
    opacity: 1;
    transition: 0.25s ease-out;
    transition-property: width, left;
`;

const menuItems = [
    // {
    //     icon: (
    //         <svg
    //             width="30"
    //             height="31"
    //             viewBox="0 0 30 31"
    //             fill="none"
    //             xmlns="http://www.w3.org/2000/svg"
    //         >
    //             <path
    //                 opacity="0.75"
    //                 fillRule="evenodd"
    //                 clipRule="evenodd"
    //                 d="M20.2998 1.42534C20.7247 -0.467179 23.4924 -0.478485 23.9359 1.41177L23.9568 1.50222L23.9986 1.67632C24.5094 3.79721 26.2717 5.4184 28.4798 5.79147C30.5067 6.13516 30.5067 8.97054 28.4798 9.31423C27.3946 9.49773 26.3894 9.98949 25.5904 10.7277C24.7915 11.4659 24.2344 12.4177 23.9893 13.4633L23.9359 13.6939C23.4947 15.5842 20.7247 15.5729 20.2975 13.6804L20.2534 13.4814C20.0181 12.432 19.4671 11.4746 18.6706 10.7316C17.874 9.98855 16.8682 9.49353 15.7815 9.30971C13.7591 8.96828 13.7591 6.13742 15.7815 5.796C16.8643 5.61294 17.8669 5.12088 18.6623 4.38222C19.4576 3.64356 20.0097 2.69156 20.2487 1.64693L20.2813 1.50222L20.2998 1.42534ZM15.345 11.7449C14.7725 11.6529 14.2233 11.4557 13.7266 11.1638H7.8825C6.16841 11.1635 4.51441 11.7788 3.23698 12.8918C1.95955 14.0048 1.14839 15.5374 0.958696 17.1963L0.0299497 25.3543C-0.10073 26.537 0.198901 27.7269 0.876627 28.7166C1.55435 29.7063 2.5672 30.433 3.73866 30.7701C4.91012 31.1073 6.16592 31.0334 7.2872 30.5614C8.40849 30.0895 9.32416 29.2493 9.87466 28.1874L10.6966 26.5888H17.4904L18.31 28.1874C18.8567 29.2554 19.7722 30.1017 20.8957 30.578C22.0193 31.0543 23.2792 31.13 24.4544 30.792C25.6295 30.4539 26.645 29.7237 27.3225 28.7294C27.9999 27.735 28.2962 26.5401 28.1593 25.3543L27.2306 17.1963C27.1245 16.2594 26.8185 15.3545 26.332 14.5396C25.0736 18.7045 18.8045 18.5778 17.8224 14.2072L17.776 14.0082C17.6479 13.439 17.3488 12.9198 16.9167 12.5167C16.4846 12.1137 15.9391 11.845 15.3496 11.7449H15.345ZM9.60532 16.6718C9.60532 16.297 9.45243 15.9375 9.18028 15.6725C8.90814 15.4075 8.53903 15.2586 8.15415 15.2586C7.76928 15.2586 7.40017 15.4075 7.12803 15.6725C6.85588 15.9375 6.70299 16.297 6.70299 16.6718V17.8294H5.51419C5.12932 17.8294 4.76021 17.9783 4.48807 18.2433C4.21592 18.5084 4.06303 18.8678 4.06303 19.2426C4.06303 19.6174 4.21592 19.9768 4.48807 20.2419C4.76021 20.5069 5.12932 20.6558 5.51419 20.6558H6.70299V21.8134C6.70299 22.1882 6.85588 22.5477 7.12803 22.8127C7.40017 23.0777 7.76928 23.2266 8.15415 23.2266C8.53903 23.2266 8.90814 23.0777 9.18028 22.8127C9.45243 22.5477 9.60532 22.1882 9.60532 21.8134V20.6558H10.7941C11.179 20.6558 11.5481 20.5069 11.8202 20.2419C12.0924 19.9768 12.2453 19.6174 12.2453 19.2426C12.2453 18.8678 12.0924 18.5084 11.8202 18.2433C11.5481 17.9783 11.179 17.8294 10.7941 17.8294H9.60532V16.6718ZM20.6342 20.6196C20.6452 20.8071 20.6168 20.9948 20.5508 21.1712C20.4847 21.3476 20.3823 21.509 20.2499 21.6455C20.1175 21.782 19.9579 21.8908 19.7808 21.9651C19.6038 22.0395 19.413 22.0778 19.2202 22.0778C19.0273 22.0778 18.8365 22.0395 18.6595 21.9651C18.4824 21.8908 18.3228 21.782 18.1904 21.6455C18.058 21.509 17.9556 21.3476 17.8896 21.1712C17.8235 20.9948 17.7951 20.8071 17.8061 20.6196C17.8268 20.268 17.9848 19.9375 18.2477 19.6957C18.5107 19.454 18.8586 19.3193 19.2202 19.3193C19.5818 19.3193 19.9297 19.454 20.1926 19.6957C20.4555 19.9375 20.6135 20.268 20.6342 20.6196Z"
    //                 fill="url(#paint0_linear_115_1229)"
    //             />
    //             <LinearGradientActiveItems />
    //         </svg>
    //     ),
    //     txt: "Store",
    //     link: "/",
    // },
    // {
    //     icon: (
    //         <svg
    //             width="26"
    //             height="26"
    //             viewBox="0 0 26 26"
    //             fill="none"
    //             xmlns="http://www.w3.org/2000/svg"
    //         >
    //             <path
    //                 fillRule="evenodd"
    //                 clipRule="evenodd"
    //                 d="M8.61839 7.15842H17.2157C21.5738 7.15842 23.7541 7.15842 24.9786 8.43329C26.2019 9.70817 25.9138 11.6767 25.3377 15.615L24.7926 19.3505C24.3406 22.4388 24.1145 23.9837 22.9559 24.9085C21.7973 25.8333 20.0884 25.8333 16.6694 25.8333H9.16477C5.74702 25.8333 4.03685 25.8333 2.87823 24.9085C1.7196 23.9837 1.49356 22.4388 1.04148 19.3505L0.496395 15.615C-0.0809802 11.6767 -0.369022 9.70817 0.855478 8.43329C2.07998 7.15842 4.26031 7.15842 8.61839 7.15842ZM7.75039 20.6667C7.75039 20.1319 8.23219 19.6979 8.82635 19.6979H17.0078C17.6019 19.6979 18.0837 20.1319 18.0837 20.6667C18.0837 21.2014 17.6019 21.6354 17.0078 21.6354H8.82635C8.23219 21.6354 7.75039 21.2014 7.75039 20.6667Z"
    //                 fill="url(#paint0_linear_115_1229)"
    //             />
    //             <path
    //                 opacity="0.4"
    //                 d="M8.40918 0H17.425C17.726 0 17.9546 1.35934e-07 18.1574 0.0193751C19.5886 0.160167 20.7588 1.02042 21.2561 2.17904H4.57809C5.07539 1.02042 6.24693 0.160167 7.67809 0.0193751C7.8783 1.35934e-07 8.10951 0 8.40918 0Z"
    //                 fill="url(#paint0_linear_115_1229)"
    //             />
    //             <path
    //                 opacity="0.7"
    //                 d="M5.56749 3.51721C3.77207 3.51721 2.29957 4.60221 1.80874 6.03984C1.79798 6.06983 1.78765 6.09997 1.77774 6.13025C2.29837 5.97806 2.8306 5.86876 3.36907 5.80346C4.76407 5.62521 6.52849 5.62521 8.57707 5.62521H17.4792C19.5278 5.62521 21.2922 5.62521 22.6872 5.80346C23.2297 5.87321 23.7645 5.97525 24.2786 6.13025C24.2691 6.09999 24.2592 6.06985 24.2489 6.03984C23.758 4.60092 22.2855 3.51721 20.4888 3.51721H5.56749Z"
    //                 fill="url(#paint0_linear_115_1229)"
    //             />
    //             <LinearGradientActiveItems />
    //         </svg>
    //     ),
    //     txt: "Market",
    //     link: "/market",
    // },
    {
        icon: (
            <svg
                width="25"
                height="23"
                viewBox="0 0 25 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.375 0C19.7631 0 20.1459 0.0903627 20.493 0.263932C20.8402 0.437501 21.1421 0.689509 21.375 1L24.735 5.48C24.9037 5.70096 24.9934 5.97205 24.99 6.25H25V7.5C25.0012 8.71815 24.5566 9.89464 23.75 10.8075V20C23.75 20.663 23.4866 21.2989 23.0178 21.7678C22.5489 22.2366 21.913 22.5 21.25 22.5H3.75C3.08696 22.5 2.45108 22.2366 1.98224 21.7678C1.5134 21.2989 1.25001 20.663 1.25001 20V10.8075C0.4429 9.89495 -0.00180409 8.71826 5.50102e-06 7.5V6.25H0.0100054C0.00657154 5.97205 0.096348 5.70096 0.265005 5.48L3.625 1C3.85787 0.689509 4.15983 0.437501 4.50697 0.263932C4.85411 0.0903627 5.23689 0 5.625 0H19.375ZM22.5 7.5H17.5C17.4971 8.14873 17.7465 8.77318 18.1955 9.24144C18.6445 9.70969 19.2579 9.98508 19.9062 10.0094C20.5545 10.0338 21.1868 9.80515 21.6696 9.37188C22.1525 8.93861 22.448 8.33462 22.4937 7.6875L22.5 7.5ZM15 7.5H10C9.9971 8.14873 10.2465 8.77318 10.6955 9.24144C11.1445 9.70969 11.7579 9.98508 12.4062 10.0094C13.0545 10.0338 13.6868 9.80515 14.1696 9.37188C14.6525 8.93861 14.948 8.33462 14.9938 7.6875L15 7.5ZM7.5 7.5H2.5C2.4971 8.14873 2.74649 8.77318 3.19548 9.24144C3.64447 9.70969 4.2579 9.98508 4.90618 10.0094C5.55446 10.0338 6.18681 9.80515 6.66965 9.37188C7.15249 8.93861 7.448 8.33462 7.49375 7.6875L7.5 7.5Z"
                    fill="url(#paint0_linear_115_1229)"
                />
                <LinearGradientActiveItems />
            </svg>
        ),
        txt: "Library",
        link: "/library",
    },
    // {
    //     icon: (
    //         <svg
    //             width="31"
    //             height="31"
    //             viewBox="0 0 31 31"
    //             fill="none"
    //             xmlns="http://www.w3.org/2000/svg"
    //         >
    //             <g filter="url(#filter0_b_115_1256)">
    //                 <path
    //                     d="M10.852 21.7C11.7045 21.7 12.4345 21.3967 13.0421 20.7902C13.6497 20.1836 13.953 19.4535 13.952 18.6C13.952 17.7475 13.6487 17.018 13.0421 16.4114C12.4355 15.8048 11.7055 15.501 10.852 15.5C9.99945 15.5 9.26992 15.8038 8.66335 16.4114C8.05679 17.019 7.75299 17.7485 7.75195 18.6C7.75195 19.4525 8.05575 20.1826 8.66335 20.7902C9.27095 21.3978 10.0005 21.701 10.852 21.7ZM20.152 21.7C21.0045 21.7 21.7345 21.3967 22.3421 20.7902C22.9497 20.1836 23.253 19.4535 23.252 18.6C23.252 17.7475 22.9487 17.018 22.3421 16.4114C21.7355 15.8048 21.0055 15.501 20.152 15.5C19.2995 15.5 18.5699 15.8038 17.9634 16.4114C17.3568 17.019 17.053 17.7485 17.052 18.6C17.052 19.4525 17.3558 20.1826 17.9634 20.7902C18.571 21.3978 19.3005 21.701 20.152 21.7ZM15.502 13.95C16.3545 13.95 17.0845 13.6467 17.6921 13.0402C18.2997 12.4336 18.603 11.7035 18.602 10.85C18.602 9.9975 18.2987 9.26797 17.6921 8.6614C17.0855 8.05483 16.3555 7.75103 15.502 7.75C14.6495 7.75 13.9199 8.0538 13.3134 8.6614C12.7068 9.269 12.403 9.99853 12.402 10.85C12.402 11.7025 12.7058 12.4326 13.3134 13.0402C13.921 13.6478 14.6505 13.951 15.502 13.95ZM15.502 31C13.3578 31 11.3428 30.5929 9.45695 29.7786C7.57112 28.9643 5.9307 27.8602 4.5357 26.4663C3.1407 25.0713 2.03659 23.4308 1.22335 21.545C0.41012 19.6592 0.00298646 17.6442 0.00195312 15.5C0.00195312 13.3558 0.409087 11.3408 1.22335 9.455C2.03762 7.56917 3.14174 5.92875 4.5357 4.53375C5.9307 3.13875 7.57112 2.03463 9.45695 1.2214C11.3428 0.408167 13.3578 0.00103333 15.502 0C17.6461 0 19.6611 0.407133 21.547 1.2214C23.4328 2.03567 25.0732 3.13978 26.4682 4.53375C27.8632 5.92875 28.9678 7.56917 29.7821 9.455C30.5964 11.3408 31.003 13.3558 31.002 15.5C31.002 17.6442 30.5948 19.6592 29.7806 21.545C28.9663 23.4308 27.8622 25.0713 26.4682 26.4663C25.0732 27.8613 23.4328 28.9659 21.547 29.7801C19.6611 30.5944 17.6461 31.001 15.502 31Z"
    //                     fill="url(#paint0_linear_115_1229)"
    //                 />
    //             </g>
    //             <LinearGradientActiveItems />
    //         </svg>
    //     ),
    //     txt: "Social",
    //     link: "/social",
    // },
];