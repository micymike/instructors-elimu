import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const DroppableWrapper = ({
    children,
    droppableId,
    direction = 'vertical',
    type = 'DEFAULT',
    mode = 'standard',
    isDropDisabled = false,
    isCombineEnabled = false,
    ignoreContainerClipping = false,
    ...props
}) => (
    <Droppable
        droppableId={droppableId}
        direction={direction}
        type={type}
        mode={mode}
        isDropDisabled={isDropDisabled}
        isCombineEnabled={isCombineEnabled}
        ignoreContainerClipping={ignoreContainerClipping}
        {...props}
    >
        {children}
    </Droppable>
);

export default DroppableWrapper; 