import React from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

type DroppableWrapperProps = DroppableProps & {
    direction?: 'vertical' | 'horizontal';
    type?: string;
    mode?: 'standard' | 'virtual';
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    ignoreContainerClipping?: boolean;
    renderClone?: any;
};

export const DroppableWrapper = ({
    children,
    direction = 'vertical',
    type = 'DEFAULT',
    mode = 'standard',
    isDropDisabled = false,
    isCombineEnabled = false,
    ignoreContainerClipping = false,
    renderClone,
    ...props
}: DroppableWrapperProps) => {
    return (
        <Droppable
            direction={direction}
            type={type}
            mode={mode}
            isDropDisabled={isDropDisabled}
            isCombineEnabled={isCombineEnabled}
            ignoreContainerClipping={ignoreContainerClipping}
            renderClone={renderClone}
            {...props}
        >
            {children}
        </Droppable>
    );
}; 