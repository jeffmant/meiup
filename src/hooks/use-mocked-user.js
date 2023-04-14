export const useMockedUser = () => {
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  return {
    id: '5e86809283e28b96d2d38537',
    avatar: 'https://github.com/jeffmant.png',
    name: 'Jefferson Mantovani',
    phone: '11936187180',
    email: 'jgsmantovani@gmail.com',
    cpf: '08468678937',
    company: {
      id: '7f86809283e28b96d2d38598',
      name: 'Jefferson Gabriel Silva Mantovani 08468678937',
      fantasyName: 'BOAZ Tecnologias'
    }
  };
};
