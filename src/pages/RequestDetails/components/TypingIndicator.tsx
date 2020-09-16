import * as React from 'react';
import './TypingIndicator.style.less';

function TypingIndicator() {
    return (
        <div className="ticontainer">
            <div className="tiblock">
                <div className="tidot"></div>
                <div className="tidot"></div>
                <div className="tidot"></div>
            </div>
        </div>
    )
}

export default TypingIndicator;