import {Link} from 'react-router-dom'

import {styled} from '@stitches/react'

const StyledLink = styled(Link, {
    backgroundColor:'#0163C6',
});



interface LinkButtonProps {
    to: string;
    text: string;
}

function LinkButton({to, text}: LinkButtonProps) {

    return (
        <StyledLink to={to}>
            {text}
        </StyledLink>
    )
}

export default LinkButton;