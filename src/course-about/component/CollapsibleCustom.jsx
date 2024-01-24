import {Collapsible} from '@edx/paragon'
import minuIcon from '../assets/minus.svg';
import pushIcon from '../assets/push.svg';
import arrowIcon from '../assets/Arrow-expand.svg'
import arrowCollapseIcon from '../assets/Arrow-collapse.svg'


const CollapsibleCustom = ({title, children})=>{

    return (

        <Collapsible.Advanced className="collapsible-container">
            <Collapsible.Trigger className="collapsible-trigger d-flex">
                <span className="flex-grow-1 collapsible-title">{title}</span>
                <Collapsible.Visible whenClosed> <img src={pushIcon} alt='push' /> </Collapsible.Visible>
                <Collapsible.Visible whenOpen> <img src={minuIcon} alt='minu' /> </Collapsible.Visible>
            </Collapsible.Trigger>

            <Collapsible.Body className="collapsible-body">
                {children}
            </Collapsible.Body>
        </Collapsible.Advanced>
    )

}

export default CollapsibleCustom