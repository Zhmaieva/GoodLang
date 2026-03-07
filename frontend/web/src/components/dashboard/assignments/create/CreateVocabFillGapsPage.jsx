import React, {useEffect, useState} from "react";
import Page from "../../Page.jsx";
import Input from "../../Input.jsx";
import NumberSlider from "../../NumberSlider.jsx";
import PageLeft from "../../PageLeft.jsx";
import PageRight from "../../PageRight.jsx";
import ChooseLevel from "../../ChooseLevel.jsx";
import HorizontalGroup from "../../HorizontalGroup.jsx";
import TextLoadingPreview from "../../TextLoadingPreview.jsx";
import FooterNextButtons from "../../FooterNextButtons.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";
import {LEVELS} from "../../../../utils/constants.js";

export function CreateVocabFillGapsPage() {
    const [taskReady, setTaskReady] = useState(false);
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState(LEVELS[2]);
    const [tasksSelected, setTasksSelected] = useState(5);

    useEffect(() => {
        setTaskReady(tasksSelected > 0 && topic && level);//TODO: adjust after a time gap and reset if before the timer trigger
    }, [tasksSelected, topic, level])

    return (
        <Page
            title={"Vocabulary gap text generator"}
            subtitle={"Generate vocabulary and create a gap-fill text automatically"}
        >
            <PageLeft>
                <HorizontalGroup>
                    <Input
                        placeholder={`Enter topic (e.g. 'At the playground')`}
                        mode="raw"
                        charLimit={120}
                        value={topic}
                        onChange={(value) => {
                            setTopic(value);
                        }}
                        subtext={null}
                    />
                    <NumberSlider
                        value={tasksSelected}
                        onChange={(value) => {
                            setTasksSelected(value);
                        }}
                        min={5}
                        max={30}
                        step={1}
                        wordSingular="word"
                        wordPlural="words"
                        // postText="in the assignment"
                        subtitle="Pick how many topic words the text will receive."
                    />
                </HorizontalGroup>
                <HorizontalGroup>
                    <ChooseLevel initialLevel={level} onChange={setLevel}/>
                </HorizontalGroup>
                <HorizontalGroup>
                    <TextLoadingPreview/>
                </HorizontalGroup>
            </PageLeft>
            <PageRight style={{
                justifyContent: 'flex-end',
            }}>
                <FooterNextButtons
                    disabled={!taskReady}
                >
                    <AwesomeActionButton
                        size="regular"
                        variant={"ghost"}
                        onClick={() => {
                            //const assignmentType = getLastPathEdge(location.pathname);
                            //const params = new URLSearchParams();
                            // params.set("type", assignmentType);
                            // params.set("taskMode", 'gaps');
                            // params.set("tasks", String(tasksSelected));
                            // params.set("rules", selected.join(",")); // ids list
                            //navigate(`/school/assignments/create-assignment/share?${params.toString()}`);
                        }}
                    >
                        Save and share with students
                    </AwesomeActionButton>
                </FooterNextButtons>
            </PageRight>
        </Page>
    );
}