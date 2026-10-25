import { CaretRight } from "@phosphor-icons/react";

export default function MobileSettingsRow({ label, value, children, detail, onClick, href }) {
    const Row = href ? "a" : onClick ? "button" : "div";
    return <Row className="gl-settings-row" onClick={onClick} href={href} type={onClick && !href ? "button" : undefined}>
        <span className="gl-settings-label">{label}{detail && <small>{detail}</small>}</span>
        <span className="gl-settings-value">{children ?? (value && <bdi>{value}</bdi>)}
            {(onClick || href) && <CaretRight size={17} aria-hidden="true" />}
        </span>
    </Row>;
}
