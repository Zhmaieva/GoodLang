import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const positionValue = (value, unit, isBase, axis) => {
    if (unit === "px") return `${value}px`;
    if (!isBase) return `${value * 100}%`;
    return `${value * 100}${axis === "x" ? "vw" : "vh"}`;
};

const transformOrigin = (pivot) => pivot.unit === "px"
    ? `${pivot.x}px ${pivot.y}px`
    : `${pivot.x * 100}% ${pivot.y * 100}%`;

const imageStyle = (image) => ({
    position: "relative",
    display: "block",
    maxWidth: "none",
    visibility: image.state.visible ? "visible" : "hidden",
    zIndex: image.state.zIndex,
    userSelect: "none",
    ...image.style,
});

const childStyle = (image) => ({
    position: "absolute",
    left: positionValue(image.state.x, image.state.xUnit, false, "x"),
    top: positionValue(image.state.y, image.state.yUnit, false, "y"),
    width: "max-content",
    height: "max-content",
    transform: `rotate(${image.state.rotation}deg)`,
    transformOrigin: transformOrigin(image.state.pivot),
    transition: [
        `left ${image.state.transitionMs.x}ms linear`,
        `top ${image.state.transitionMs.y}ms linear`,
        `transform ${image.state.transitionMs.rotation}ms linear`,
    ].join(", "),
    zIndex: image.state.zIndex,
    pointerEvents: "none",
});

export default function SkeletalAnimation({ skeleton, className = "" }) {
    const [, setRevision] = useState(0);

    useEffect(() => skeleton.subscribe(() => {
        setRevision((revision) => revision + 1);
    }), [skeleton]);

    const base = skeleton.baseImage;
    const children = skeleton.images.filter((image) => image.parentId === base.id);

    if (!skeleton.visible || typeof document === "undefined") return null;

    return createPortal(
        <div
            className={className}
            aria-hidden="true"
            style={{
                position: "fixed",
                left: positionValue(base.state.x, base.state.xUnit, true, "x"),
                top: positionValue(base.state.y, base.state.yUnit, true, "y"),
                width: "max-content",
                height: "max-content",
                transform: `rotate(${base.state.rotation}deg)`,
                transformOrigin: transformOrigin(base.state.pivot),
                transition: [
                    `left ${base.state.transitionMs.x}ms linear`,
                    `top ${base.state.transitionMs.y}ms linear`,
                    `transform ${base.state.transitionMs.rotation}ms linear`,
                ].join(", "),
                zIndex: base.state.zIndex,
                pointerEvents: "none",
                overflow: "visible",
                contain: "layout style",
            }}
        >
            <img
                src={base.src}
                alt={base.alt}
                draggable={false}
                className={base.className}
                style={imageStyle(base)}
            />
            {children.map((image) => (
                <div key={image.id} style={childStyle(image)}>
                    <img
                        src={image.src}
                        alt={image.alt}
                        draggable={false}
                        className={image.className}
                        style={imageStyle(image)}
                    />
                </div>
            ))}
        </div>,
        document.body,
    );
}
