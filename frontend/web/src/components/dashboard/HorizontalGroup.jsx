import {theme} from "../../App.jsx";

export default function HorizontalGroup({children}) {
    return (
        <div style={{
            display: "flex",
            paddingLeft: theme.bottomDynamicList.padX * 2,
            paddingBottom: theme.bottomDynamicList.padTop,
            paddingRight: theme.bottomDynamicList.padX * 2,
            gap: theme.spacing.gap
        }}>
            {children}
        </div>
    )
}

