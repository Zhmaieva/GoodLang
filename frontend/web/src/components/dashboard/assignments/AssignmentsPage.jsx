import EmptyContent from "../EmpyContent.jsx";
import {useNavigate} from "react-router-dom";

export function AssignmentsPage() {
    const navigate = useNavigate();

    return (<>
        <EmptyContent
            sourceText={"Let's get started"}
            subtitle={"Create an assignment to share it with your students within a minute"}
            actionText={"Create assignment"}
            actionSymbol={'+'}
            variant={'ghost'}
            onAction={() => {
                navigate("/school/assignments/create-assignment");
            }}
        />

    </>);
}