import c from './Loader.module.css';

const Loader = (() => {
    return (
        <div className={c.back}>
            <div class={c.loader}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
});

export default Loader;