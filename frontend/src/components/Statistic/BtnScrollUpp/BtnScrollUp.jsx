import React, { useEffect, useState } from 'react';

function BtnScrollUp() {
    const [showBtn, setShowBtn] = useState();

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
    }, []);

    function onScroll() {
        setShowBtn(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
    }

    const handlerScrollUp = () => {
        window.scroll(0, 0);
    }

    return (
        <button className={`btn btn-danger btn-floating btn-lg ${showBtn ? 'show' : 'hidden'}`} id="btn-back-to-top" onClick={handlerScrollUp}>{/* style="display: block;"*/}
            <i className="fas fa-arrow-up" aria-hidden="true"></i>
        </button>
    );
}

export default BtnScrollUp;