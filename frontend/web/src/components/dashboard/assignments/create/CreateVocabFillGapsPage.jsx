import React, { useMemo, useRef, useState } from "react";
import Page from "../../Page.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";
import Input from "../../Input.jsx";
import NumberSlider from "../../NumberSlider.jsx";
import { Chip } from "../../Chip.jsx";
import { theme } from "../../../../App.jsx";
import EmptyContent from "../../EmptyContent.jsx";
import {
    apiGenerateStoryFromWords,
    apiGenerateTopicWords,
} from "../../../../services/api.js";

export function CreateVocabFillGapsPage() {
    const [tasksSelected, setTasksSelected] = useState(5);

    return (
        <Page
            title={"Vocabulary gap text generator"}
            subtitle={"Generate vocabulary and create a gap-fill text automatically"}
        >

        </Page>
    );
}