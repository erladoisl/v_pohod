import Eatings from "./Eatings/Eatings";

const Menu = ((props) => {

    return (
        <>
            <Eatings day_id={props.day_id} />
        </>
    );
});

export default Menu;