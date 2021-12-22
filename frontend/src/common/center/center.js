
import style from "./center.module.scss";

export default function Center({ children }) {

    return (
        <div className={style.wrapper}>
            {children}
        </div>
    )
}