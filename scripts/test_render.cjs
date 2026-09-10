const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('HTML Length:', data.length);
    console.log('Has Hero:', data.includes('Proteja o assoalho'));
    console.log('Has Oferta:', data.includes('Kit de tapetes 3D'));
    console.log('Has Reviews:', data.includes('Avaliações de clientes'));
    console.log('Has FAQ:', data.includes('Perguntas frequentes'));
    console.log('Has Specs:', data.includes('Ficha técnica'));
    console.log('Has Company:', data.includes('Atendemos a todo o Brasil'));
    console.log('Has Cart:', data.includes('Seu pedido'));
    console.log('Has Checkout:', data.includes('Seus dados'));
    console.log('Has R$ 247:', data.includes('247'));
    console.log('Has R$ 197:', data.includes('197'));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
