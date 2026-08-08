import { styled } from '@stitches/react';

const DivStyled = styled('div', {
  backgroundColor: '#F1F2F6',
  width: '100%',
  flex: 1,
  flexDirection: 'column',
  display: 'flex',
});


function Credential() {

  return (

    <DivStyled>

      <h1>Credential</h1>

    </DivStyled>

  );
}

export default Credential;