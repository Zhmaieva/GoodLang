import React, {useEffect, useState, useRef} from "react";
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
import {theme} from "../../../../App.jsx";
import {apiGenerateStoryFromTopic} from "../../../../services/api.js";

export function CreateVocabFillGapsPage() {
    const [taskReady, setTaskReady] = useState(false);
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState(LEVELS[2]);
    const [tasksSelected, setTasksSelected] = useState(5);

    const [generatedText, setGeneratedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const debounceTimer = useRef(null);

    useEffect(() => {
        setTaskReady(tasksSelected > 0 && topic && level);

        if (!topic) return;

        // Show loading preview immediately, clear any existing text
        setIsLoading(true);
        setGeneratedText("");

        // Reset the timer on every change
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            try {
                const result = await apiGenerateStoryFromTopic({topic, level, numberOfWords: tasksSelected});
                setGeneratedText(result?.text?.split("[[p]]")?.join(".\n\n    "));
            } finally {
                setIsLoading(false);
            }
        }, 3000);

        return () => clearTimeout(debounceTimer.current);
    }, [tasksSelected, topic, level]);

    return (
        <Page
            title={"Vocabulary gap text generator"}
            subtitle={"Generate vocabulary and create a gap-fill text automatically"}
        >
            <PageLeft style={{gap: theme.spacing.gap}}>
                <HorizontalGroup>
                    <Input
                        placeholder={`Enter topic (e.g. 'At the playground')`}
                        mode="raw"
                        charLimit={120}
                        value={topic}
                        onChange={(value) => setTopic(value)}
                        subtext={null}
                    />
                    <NumberSlider
                        value={tasksSelected}
                        onChange={(value) => setTasksSelected(value)}
                        min={5}
                        max={30}
                        step={1}
                        wordSingular="word"
                        wordPlural="words"
                        subtitle="Pick how many topic words the text will receive."
                    />
                </HorizontalGroup>
                <HorizontalGroup>
                    <ChooseLevel initialLevel={level} onChange={setLevel}/>
                </HorizontalGroup>
                <HorizontalGroup visibleIf={!!topic}>
                    {isLoading && <TextLoadingPreview/>}
                    {generatedText && !isLoading && <p>{generatedText}</p>}
                </HorizontalGroup>
            </PageLeft>
            <PageRight style={{justifyContent: 'flex-end'}}>
                <FooterNextButtons disabled={!taskReady}>
                    <AwesomeActionButton
                        size="regular"
                        variant={"ghost"}
                        onClick={() => {}}
                    >
                        Save and share with students
                    </AwesomeActionButton>
                </FooterNextButtons>
            </PageRight>
        </Page>
    );
}