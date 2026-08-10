import { useState } from 'react';
import CardCredencial from '../layout/CardCredencial';;

import { styled } from '@stitches/react';


const DivStyled = styled('div', {
  backgroundColor: '#F1F2F6',
  width: '100%',
  flex: 1,
  flexDirection: 'column',
  display: 'flex',
  padding: '48px 48px',
  boxSizing: 'border-box',
});



function Credential() {

  return (

    <DivStyled>

      <CardCredencial />
      
    </DivStyled>

  );
}

export default Credential;