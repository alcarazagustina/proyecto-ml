const express = require('express');
const axios = require('axios');
const router = express.Router();

// Datos de autor (puedes personalizarlos)
const AUTHOR = {
  name: 'Agustin',
  lastname: 'Apellido'
};

// Datos mock para items
const MOCK_ITEMS = [
  {
    id: 'MLA1',
    title: 'iPhone 13',
    price: { currency: 'ARS', amount: 1200000, decimals: 0 },
    picture: 'https://http2.mlstatic.com/D_NQ_NP_2X_12345-MLA1234567890_092021-F.webp',
    condition: 'new',
    free_shipping: true,
    location: 'Capital Federal'
  },
  {
    id: 'MLA2',
    title: 'iPhone 12',
    price: { currency: 'ARS', amount: 900000, decimals: 0 },
    picture: 'https://http2.mlstatic.com/D_NQ_NP_2X_54321-MLA0987654321_092021-F.webp',
    condition: 'used',
    free_shipping: false,
    location: 'Buenos Aires'
  },
  {
    id: 'MLA3',
    title: 'iPhone 11',
    price: { currency: 'ARS', amount: 700000, decimals: 0 },
    picture: 'https://http2.mlstatic.com/D_NQ_NP_2X_67890-MLA1122334455_092021-F.webp',
    condition: 'used',
    free_shipping: true,
    location: 'Córdoba'
  },
  {
    id: 'MLA4',
    title: 'iPhone XR',
    price: { currency: 'ARS', amount: 500000, decimals: 0 },
    picture: 'https://http2.mlstatic.com/D_NQ_NP_2X_98765-MLA5566778899_092021-F.webp',
    condition: 'used',
    free_shipping: false,
    location: 'Rosario'
  }
];

const MOCK_CATEGORIES = ['Celulares y Teléfonos', 'iPhone'];

// Endpoint: /api/items?q=:query
router.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Falta el parámetro de búsqueda (q)' });
  }
  try {
    // Intentar consultar la API de Mercado Libre
    const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(query)}`);
    const data = response.data;

    // Extraer categorías (breadcrumb)
    let categories = [];
    if (data.filters && data.filters.length > 0) {
      const categoryFilter = data.filters.find(f => f.id === 'category');
      if (categoryFilter && categoryFilter.values.length > 0 && categoryFilter.values[0].path_from_root) {
        categories = categoryFilter.values[0].path_from_root.map(cat => cat.name);
      }
    }

    // Tomar solo los primeros 4 resultados
    const items = data.results.slice(0, 4).map(item => ({
      id: item.id,
      title: item.title,
      price: {
        currency: item.currency_id,
        amount: Math.floor(item.price),
        decimals: Math.round((item.price % 1) * 100)
      },
      picture: item.thumbnail,
      condition: item.condition,
      free_shipping: item.shipping.free_shipping,
      location: item.address.state_name
    }));

    res.json({
      author: AUTHOR,
      categories,
      items
    });
  } catch (error) {
    console.error('Error consultando la API de Mercado Libre:', error.message);
    // Devolver datos mock
    res.json({
      author: AUTHOR,
      categories: MOCK_CATEGORIES,
      items: MOCK_ITEMS
    });
  }
});

// Endpoint: /api/items/:id
router.get('/:id', async (req, res) => {
  // Aquí irá la lógica para detalle de producto
  res.json({ message: 'Detalle de producto' });
});

module.exports = router; 