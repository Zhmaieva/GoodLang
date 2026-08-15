import React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
    APP_ACCENT_COLOR,
    APP_ACCENT_SOFT_COLOR,
    APP_BORDER_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../theme.js";

function getPageItems(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, currentPage]);

    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    if (currentPage <= 3) pages.add(2).add(3).add(4);
    if (currentPage >= totalPages - 2) {
        pages.add(totalPages - 1).add(totalPages - 2).add(totalPages - 3);
    }

    const sorted = Array.from(pages)
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b);

    return sorted.reduce((items, page, index) => {
        const previousPage = sorted[index - 1];
        if (index > 0 && page - previousPage > 1) {
            items.push(`ellipsis-${previousPage}-${page}`);
        }
        items.push(page);
        return items;
    }, []);
}

export default function Pagination({
    page,
    totalPages,
    onPageChange,
    theme,
    isMobile = false,
    style,
}) {
    if (totalPages <= 1) return null;

    const accent = theme?.accent ?? APP_ACCENT_COLOR;
    const accentSoft = theme?.accentSoft ?? APP_ACCENT_SOFT_COLOR;
    const surface = theme?.surface ?? APP_SURFACE_COLOR;
    const border = theme?.border ?? APP_BORDER_COLOR;
    const text = theme?.text ?? APP_TEXT_COLOR;
    const muted = theme?.muted ?? APP_MUTED_TEXT_COLOR;

    const pageItems = getPageItems(page, totalPages);

    const wrapStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flexWrap: "wrap",
        padding: isMobile ? "14px 10px" : "16px 12px",
        ...style,
    };

    const buttonBaseStyle = {
        appearance: "none",
        border: `1px solid ${border}`,
        minWidth: isMobile ? 36 : 38,
        height: isMobile ? 36 : 38,
        padding: "0 10px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: surface,
        color: text,
        fontFamily: "var(--font-family-base)",
        fontWeight: 800,
        fontSize: "0.9rem",
        lineHeight: 1,
        cursor: "pointer",
        transition: "background-color 140ms ease, color 140ms ease, border-color 140ms ease, opacity 140ms ease",
    };

    const disabledButtonStyle = {
        opacity: 0.45,
        cursor: "default",
    };

    const iconButton = (direction) => {
        const disabled = direction === "previous" ? page <= 1 : page >= totalPages;
        const nextPage = direction === "previous" ? page - 1 : page + 1;
        const Icon = direction === "previous" ? CaretLeft : CaretRight;

        return (
            <button
                type="button"
                aria-label={direction === "previous" ? "Previous page" : "Next page"}
                disabled={disabled}
                onClick={() => {
                    if (!disabled) onPageChange(nextPage);
                }}
                style={{
                    ...buttonBaseStyle,
                    width: isMobile ? 36 : 38,
                    padding: 0,
                    ...(disabled ? disabledButtonStyle : null),
                }}
            >
                <Icon size={17} weight="bold" />
            </button>
        );
    };

    return (
        <nav style={wrapStyle} aria-label="Pagination">
            {iconButton("previous")}

            {pageItems.map((item) => {
                if (typeof item === "string") {
                    return (
                        <span
                            key={item}
                            aria-hidden="true"
                            style={{
                                minWidth: 22,
                                color: muted,
                                textAlign: "center",
                                fontWeight: 800,
                            }}
                        >
                            ...
                        </span>
                    );
                }

                const selected = item === page;

                return (
                    <button
                        type="button"
                        key={item}
                        aria-label={`Page ${item}`}
                        aria-current={selected ? "page" : undefined}
                        onClick={() => onPageChange(item)}
                        style={{
                            ...buttonBaseStyle,
                            background: selected ? accentSoft : surface,
                            borderColor: selected ? accent : border,
                            color: selected ? accent : text,
                            cursor: selected ? "default" : "pointer",
                        }}
                    >
                        {item}
                    </button>
                );
            })}

            {iconButton("next")}
        </nav>
    );
}
