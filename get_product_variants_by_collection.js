addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function getId(data) {
  var returnData = atob(data).split('/');
  return returnData[4];
}

/**
 * Respond to the request
 * @param {Request} request
 */
 async function handleRequest(request) {
   var prettyData = [];
   const params = {}
    const url = new URL(request.url)
    const queryString = url.search.slice(1).split('&')

    queryString.forEach(item => {
      const kv = item.split('=')
      if (kv[0]) params[kv[0]] = kv[1] || true
    })

   var responseData;
    await fetch('https://YOURSHOPIFYSTOREURLHERE.myshopify.com/api/2019-07/graphql', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type' : 'application/graphql',
    'X-Shopify-Storefront-Access-Token' : 'SETYOURACCESSTOKENHERE'
  },
  body: `query {
  collectionByHandle(handle: "`+ params.collection + `") {
    products(first: 250) {
      edges {
        node {
          id
          variants(first:100) {
            edges {
              node {
                presentmentPrices(first:100){
                  edges {
                    node {
                      price {
                        amount
                      }
                    }
                  }
                }
                id
                selectedOptions{
                  name
                  value
                }
                image {
                  originalSrc
                }
              }
            }
          }
          options {
            name
            values
          }

        }
      }
    }
  }
}`
})
  .then(r => r.json())
  .then(data => {
    responseData = data.data.collectionByHandle.products.edges;

  });

  for (var p in responseData) {
    prettyData[p] = responseData[p].node;
    prettyData[p].id = getId(prettyData[p].id);
    for (var z in prettyData[p].variants.edges ) {
         prettyData[p].variants[z] = prettyData[p].variants.edges[z].node;
         prettyData[p].variants[z].id = getId(prettyData[p].variants[z].id);
         prettyData[p].variants[z].price = prettyData[p].variants[z].presentmentPrices.edges[0].node.price.amount;
         prettyData[p].variants[z].options = prettyData[p].variants[z].selectedOptions;
         prettyData[p].variants[z].image = prettyData[p].variants[z].image.originalSrc;
         delete prettyData[p].variants[z].selectedOptions;
         delete prettyData[p].variants[z].presentmentPrices

    }
    }

//   console.log(prettyData);
  response = new Response(JSON.stringify(prettyData), {status: 200})
  response.headers.set('Access-Control-Allow-Method', '*')
  response.headers.set('Access-Control-Allow-Origin', 'https://SETYOURDOMAINHERE')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response;


}
