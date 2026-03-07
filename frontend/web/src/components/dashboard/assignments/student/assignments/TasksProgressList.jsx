import React from "react";
import DynamicList from "../../../DynamicList.jsx";
import ChooseOptionGapTaskListItem from "./ChooseOptionGapTaskListItem.jsx";

export default function TasksProgressList({
                                              tasks = [],
                                              answersByTaskId = {},
                                              activeTaskId,
                                              onSelectTaskId,
                                              style = {}
                                          }) {
    return (
        <DynamicList
            style={style}
            items={tasks}
            renderItem={(task, idx) => {
                const taskId = String(task?.id || idx);

                return (
                    <ChooseOptionGapTaskListItem
                        key={taskId}
                        task={task}
                        index={idx}
                        total={tasks.length}
                        selected={activeTaskId === taskId}
                        answer={answersByTaskId[taskId]}
                        onClick={() => onSelectTaskId(taskId)}
                    />
                );
            }}
        />
    );
}
