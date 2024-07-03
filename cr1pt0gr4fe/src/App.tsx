import { useState } from 'react';
import bcrypt from 'bcryptjs';
import { Box, Button, Input, Text } from '@chakra-ui/react';

const Crypto = () => {
  const [password, setPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');
  const [comparePassword, setComparePassword] = useState('');
  const [matchResult, setMatchResult] = useState('');

  const handleHashPassword = async () => {
    try {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(password, saltRounds);
      setHashedPassword(hashed); 
    } catch(error) {
      console.error("Error hashing password", error);
    }
  };

  const handleComparePasswords = async () => {
    try {
      const match = await bcrypt.compare(comparePassword, hashedPassword);
      setMatchResult(match ? 'As senhas correspondem!' : 'As senhas não correspondem.');
    } catch(error) {
      console.error("Error comparing passwords", error);
    }
  };

  return (
    <Box display="flex" h="100vh" w="100vw" alignItems="center" justifyContent="center">
      <Box display="flex" alignItems="center" flexDir="column">
        <Text fontSize="50px" mb={5}>HASH YOUR PASSWORD</Text>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Input
            width="80%"
            type="password"
            placeholder="Digite uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb={3}
          />
          <Button colorScheme="blue" onClick={handleHashPassword} mb={3}>Hash</Button>
          {hashedPassword && (
            <Box display="flex" alignItems="center" flexDir="column" mb={5}>
              <Text>Senha digitada: {password}</Text>
              <Text>Senha hash: {hashedPassword}</Text>
            </Box>
          )}
          <Input
            width="80%"
            type="password"
            placeholder="Digite a senha para comparar"
            value={comparePassword}
            onChange={(e) => setComparePassword(e.target.value)}
            mb={3}
          />
          <Button colorScheme="green" onClick={handleComparePasswords} mb={3}>Comparar</Button>
          {matchResult && (
            <Text>{matchResult}</Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Crypto;
