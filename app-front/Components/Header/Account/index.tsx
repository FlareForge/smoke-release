import { styled } from "styled-components";
import Icon from "../../Icon";
import { useModal } from "@Components/Modal";
import Input from "@Components/Input";
import { useEffect, useState } from "react";
import useTransition from "@Components/Transition";

const RoundedBtn = ({ children, className = "", onClick = () => {}, hasAvatar = false}) => {
    return (
            <RoundedContainer
                className={className || "focusable"}
                onClick={onClick}
                $hasAvatar={hasAvatar}
            >
                {/* {!!notifs && <RoundedNbr>{notifs}</RoundedNbr>} */}
                {children}
            </RoundedContainer>
    );
};

const Login = ({ closeModal }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [clearTimeoutId, setClearTimeoutId] = useState(null);

    const login = () => {
        setError(null);
        window.app.Services.Account.login('email', { email, password }).then((status) => {
            if(clearTimeoutId) clearTimeout(clearTimeoutId);
            setClearTimeoutId(setTimeout(() => setError(null), 5000));
            if(!status) return setError('Wrong email or password');
            closeModal();
        });
    }

    return (<div>
        <h1>Login</h1>
        <LoginContainer>
            <ErrorContainer>
                {error}
            </ErrorContainer>
            <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <Input
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

        </LoginContainer>
        <div>
            <button onClick={() => closeModal()}>Cancel</button>
            <button onClick={() => login()}>Login</button>
        </div>
    </div>)
}

const ErrorContainer = styled.div`
    position: absolute;
    top: calc(var(--quintet) * 2.5) ;
    color: red;
    font-size: calc(var(--quintet) * 2.5) ;
    font-weight: bold;
`;

const AccountAvatar = () => {

    const { openModal } = useModal();
    const transition = useTransition();
    const [isLogged, setIsLogged] = useState(false);
    const [userData, setUserData] = useState(null);

    const openLogin = () => {
        if(isLogged) return transition('profile/')
        openModal(() => Login, {}, updateLogStatus);
    }

    const updateLogStatus = () => {
        window.app.Services.Account.isLogged('token').then(setIsLogged);
    }

    useEffect(() => {
        const interval = setInterval(updateLogStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        window.app.Services.Account.getUserData("token").then(setUserData);
    }, [isLogged]);

    return (
        <AvatarContainer>
            <RoundedBtn
                onClick={openLogin}
                hasAvatar={!!userData?.avatar}
            >
                {  userData?.avatar ?
                    <img src={userData.avatar} alt="avatar" /> :
                    <Icon name="account" />}
            </RoundedBtn>
        </AvatarContainer>
    );
};

export default ({ icon = null, action = null }) => {

    const transition = useTransition();

    return (
        <AccountContainer>
            <RoundedBtnsContainer>
                {!!icon && <RoundedBtn
                    onClick={() => action()}
                >
                    <Icon name={icon} />
                </RoundedBtn>}
                <RoundedBtn
                    onClick={() => transition('/settings/general')}
                >
                    <Icon name="settings" />
                </RoundedBtn>
                {/* <RoundedBtn
                    className="soon"
                >
                    <Icon name="bell" />
                </RoundedBtn>
                <RoundedBtn
                    className="soon"
                >
                    <Icon name="heart" />
                </RoundedBtn> */}
            </RoundedBtnsContainer>
            <Separator/>
            <AccountAvatar />
        </AccountContainer>
    );
};


const AccountContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const LoginContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: calc(var(--quintet) * 2.5);
    justify-content: center;
    align-items: center;
`;

const Separator = styled.div`
    width: var(--unit);
    height: calc(var(--decade) * 3.5);
    border-radius: calc(var(--decade) * 3.5) ;
    opacity: 0.5;
    margin: 0 calc(var(--quintet) * 1.5) ;
    background: linear-gradient( 180deg,  rgba(255, 107, 39, 0) 0%, var(--grey) 33%, var(--grey) 66%, rgba(255, 107, 39, 0) 100%);
`;

const AvatarContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: calc(var(--decade) * 3.5);

    &::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: calc(var(--decade) * 3.5) ;
        opacity: 0.2;
        background: black;
        filter: blur(var(--decade));
        width: calc(var(--decade) * 6);
        height: calc(var(--decade) * 6);
    }
`;

const RoundedContainer = styled.div`
    width: calc(var(--decade) * 4);
    height: calc(var(--decade) * 4);
    border-radius: 50%;
    display: flex;
    box-sizing: border-box;
    padding: ${(props: any) => (props.$hasAvatar ? "0" : "calc(var(--quintet) * 2.2)")};
    overflow: hidden;
    justify-content: center;
    align-items: center;
    background: var(--grey);
    position: relative;
    cursor: pointer;

    &:hover {
        background: var(--dark);
    }

    & svg {
        width: calc(var(--decade) * 2);
    }
`;

// const RoundedNbr = styled.div`
//     position: absolute;
//     right: -5px;
//     aspect-ratio: 1;
//     width: 12px;
//     top: -5px;
//     border-radius: calc(var(--decade) * 3.5) ;
//     border: 3px solid #3a3b44;
//     background: var(--main);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.25);
//     color: white;
//     font-family: "Kodchasan-Bold";
//     font-size: 9px;
//     padding: 4px;
// `;

const RoundedBtnsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: calc(var(--quintet) * 1.5) ;
`;
