module.exports = {
  reactStrictMode: true,
  async headers () {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }
        ]
      }
    ]
  }
}
