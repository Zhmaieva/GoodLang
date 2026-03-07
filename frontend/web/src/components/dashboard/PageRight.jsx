import {theme} from "../../App.jsx";
import {useMemo} from "react";

export default function PageRight({children}) {
    const t = theme.page;

    const styles = useMemo(
        () => ({
            right: {
                flex: "1 1 auto",
                minWidth: t.minH0,
                height: t.rightHeight,
                maxWidth: t.rightMaxWidth,
                minHeight: t.minH0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },
        }),
        [t]
    );

    return (
        <div style={styles.right}>
            {children}
        </div>
    )
}

