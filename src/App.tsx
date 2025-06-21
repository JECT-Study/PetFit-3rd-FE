import styled from '@emotion/styled';

const Style = styled.h1`
  background-color: red;
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1.5;
`;

const App = () => {
  return <Style>Hello Stylelint</Style>;
};

export default App;
