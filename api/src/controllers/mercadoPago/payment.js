const { Orders, ProductSize, OrderDetail, Users, Product } = require("../../db");
const mail = require('../../config/smtpMail')

const mercadopago = require("mercadopago");

const { PROD_ACCESS_TOKEN, CLIENT_ID, CLEINT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;

mercadopago.configure({
  access_token: PROD_ACCESS_TOKEN,
});

async function payment(req, res, next) {
  // console.log('FUNCION PAYMEEEENT')
  console.info('esto trae el request', req)
  const {
    payment_id, //1239191891
    status, //approved
    external_reference, // orderId
    //El resto no lo estamos usando
    collection_id, //1239191891
    payment_type, //credit_card
    collection_status, //approved
    merchant_order_id, //3014520874
    preference_id, //794718240-10459525-b2bf-4bba-b3fb-fae0b736861a
    site_id, //MLA
    processing_mode, //aggregator
    merchant_account_id, //null
  } = req.query;
  console.log('esta es la query!!!', req.query);
  console.log('este es el collection id', collection_id);
  //Obtenemmos el mail del user
  // const orderm = await Order.findByPk('cc64ab40-bd46-4b02-9cac-277301c294d8',
  const orderm = await Orders.findByPk(external_reference, {
    include: [
      {
        model: Users,
        attributes: ["mail", "name", "surname"],
      },
      { model: OrderDetail },
      { model: Product },
    ],
    raw: true,
    // nest: true
  });

  // const hola = orderm.get({plain: true})

  console.log("ESTA ES TODA LA DATA!!!!--------------------", orderm);
  // console.log("hola--------------------", hola);
  // console.log("ESTA ES TODA LA DATA!!!!--------------------", orderm.get({plain: true}));
  console.log("Direcciones--------------------", orderm.shippingAddress);
  console.log("Direcciones--------------------", orderm.shippingLocated);
  console.log("Direcciones--------------------", orderm.shippingCity);
  console.log("USUARIO--------------------", orderm.User.mail);
  console.log("USUARIO--------------------", orderm.User.name);
  console.log("USUARIO--------------------", orderm.User.surname);
  console.log("Producto--------------------", orderm.Products.name);
  console.log("Producto--------------------", orderm.Products.image);
  console.log("Producto--------------------", orderm.Products.price);
  // console.log("Producto--------------------", orderm.Products.sizes);

  // // console.log("ordermOrderDetail", orderm.OrderDetails);
  // console.log("PRODUCTOS-------------------------------", orderm.Products.toJSON());
  // console.log("USUARIO--------------------", orderm.User.Users.mail);
  // console.log("USUARIO--------------------", orderm.User.Users.name);
  // console.log("USUARIO--------------------", orderm.User.Users.surname);
  // console.log("Producto--------------------", orderm.Products.priceDiscount);
  // console.log("Producto--------------------", orderm.Products.Product);
  // console.log("Producto--------------------", orderm.Products.Product.name);
  // console.log("Producto--------------------", orderm.Products.Product.image);
  // console.log("Producto--------------------", orderm.Products.Product.priceDiscount);
  // console.log("Producto--------------------", orderm.Products.Product.price);
  Orders.findByPk(external_reference)
    .then((order) => {
      console.log(order)
      console.log(payment_id)
      console.log(status)
      order.payment_id = payment_id;
      order.paymentState = status;
      // console.log('order', order)
      if (status === "approved") {
        if (order.status !== "pending") {
          orderm.OrderDetails.forEach(async (product) => {
            await ProductSize.decrement(
              {
                stock: product.quantity,
              },
              {
                where: {
                  ProductId: product.ProductId,
                  SizeId: product.sizeId,
                },
              }
            );
          });
        //   await mail(orderm.Users.mail, orderm.Users.name, orderm.User.surname);
        // mail()
        //   .then((result) => console.log('Email sent...', result))
        //   .catch((error) => console.log(error.message));
          order.status = "completed";
        } else {
          order.status = "completed";
        }
      } else if (status === "pending") {
        orderm.OrderDetails.forEach(async (product) => {
          await ProductSize.decrement(
            {
              stock: product.quantity,
            },
            {
              where: {
                ProductId: product.ProductId,
                SizeId: product.sizeId,
              },
            }
          );
        });
        order.status = "pending";
      } else if (status === "rejected") {
        if (order.status === "pending") {
          orderm.OrderDetails.forEach(async (product) => {
            await ProductSize.increment(
              {
                stock: product.quantity,
              },
              {
                where: {
                  ProductId: product.ProductId,
                  SizeId: product.sizeId,
                },
              }
            );
          });
          order.status = "cancelled";
        } else {
          order.status = "cancelled";
        }
      }
      order
        .save()
        .then(() => {
          console.log(res)
          console.info("redict sucess");
          return res.redirect("http://localhost:3000/catalogue");
        })
        .catch((error) => {
          return res.redirect(
            `http://localhost:3000/catalogue/?error=${error}&where=al+salvar`
          );
        });
    })
    .catch((error) => {
      return res.redirect(
        `http://localhost:3000/catalogue/error=${error}&where=al+buscar`
      );
    });
}
//mercadopago/pagos

async function pagosId(req, res) {
  console.log("pagosId access_token,", PROD_ACCESS_TOKEN);
  // const mp = new mercadopago(access_token)
  const mp = new mercadopago(PROD_ACCESS_TOKEN);
  const id = req.params.id;
  console.info("Buscando el id", id);
  mp.get(`/v1/payments/search`, { status: "pending" }) //{"external_reference":id})
    .then((resultado) => {
      console.info("resultado", resultado);
      res.json({ resultado: resultado });
    })
    .catch((err) => {
      console.error("No se consulto:", err);
      res.json({
        error: err,
      });
    });
}

(module.exports = payment), pagosId;

/*
4509 9535 6623 3704
11/25
123
American de prueba
371180303257522
11/25
1234
Secuencia despues pagar y volver al sitio
GET /mercadopago/pagos
collection_id          = 1239191891
collection_status      = approved
payment_id             = 1239191891
status                 = approved
external_reference     = faac272e-a92d-4a15-a472-c9363559aa00
payment_type           = credit_card
merchant_order_id      = 3014520874
preference_id          = 794718240-10459525-b2bf-4bba-b3fb-fae0b736861a
site_id                = MLA
processing_mode        = aggregator
merchant_account_id    = null
*/

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//         user:'sportgymfitness198@gmail.com',
//         pass:'botlgntwqdomgxqo'
//     },
//   });
//   const mensaje = ''
// let mail = async (userMail,firstName, lastName) => {
//     await transporter.sendMail({
//         from: '"Sportgym" <foo@example.com>', // sender address
//         to: userMail, // list of receivers
//         subject: `Compra Exitosa ${firstName ? firstName : ""} ✔`, // Subject line
//         text: `Hola ${firstName && lastName ? `${firstName, lastName}`: "!"}`, // plain text body
//         html: `<b>Hola ${firstName && lastName ? `${firstName, lastName}`: ""}, excelente compra, te avisaremos cuando se despache la entrega, para  cualquier consulta relacionada o no con tu pedido, te puedes responder este correo electrónico o escribirnos por ... </b>`, // html body
//     });
// }



//mercadopago/pagos


