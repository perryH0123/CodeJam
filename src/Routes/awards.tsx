import { useState } from 'react';
import { useModifiedPayload } from '../App';
import DefaultImage from '../content/ABC_Code_Jam_logo.png';

const Awards = () => {
    const {awards} = useModifiedPayload()

    const [showAwards, ] = useState(false)
    if(showAwards || (awards && awards.length > 0)) {
    return (<section id="awards">
        <h2>Awards</h2>
        <div id="awards-container">
            {awards[0] && <div id="1st">
                <h2>Best Overall</h2>
                <img src={awards[0]?.img || DefaultImage} alt=""/>
                <h3>{awards[0].team}</h3>
            </div>}
            {awards.length > 1 && awards[1] && <div id="2nd">
                <h2>Finalist Project</h2>
                <img src={awards[1]?.img || DefaultImage} alt=""/>
                <h3>{awards[1].team}</h3>
            </div>}
            {awards.length > 2 && awards[2] && <div id="3nd">
                <h2>Most Creative</h2>
                <img src={awards[2]?.img || DefaultImage} alt=""/>
                <h3>{awards[2].team}</h3>
            </div>}
            {awards.length > 3 && awards[3] && <div id="boards">
                <h2>Board's Choice</h2>
                <img src={awards[3]?.img || DefaultImage} alt=""/>
                <h3>{awards[3].team}</h3>
            </div>}
            {awards.length > 4 && awards[4] && <div id="honorable">
                <h2>Honorable Mention</h2>
                <img src={awards[4]?.img || DefaultImage} alt=""/>
                <h3>{awards[4].team}</h3>
            </div>}
        </div>
    </section>)
    } else {
        return (<section id="awards">
            <h2>Awards</h2>
            <div id="awards-container">
                <h3 style={{margin: "0 auto"}}>Awards have not yet been released.</h3>
            </div>
        </section>)
    }
}

export default Awards;