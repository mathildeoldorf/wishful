exports.seed = async function (knex) {
  const wishlistIDs = await knex.select("ID").from("Wishlist");
  wishlistIDs.sort(function (a, b) {
    return a.ID - b.ID;
  });
  return knex("WishlistLine").insert([{
      title: "Ivar Cabinet from IKEA",
      description: "IVAR opbevaringssystem er fantastisk og har trofast opfyldt kundernes behov overalt i hjemmet i mere end 50 år. Lofter, stuer, viktualierum og soveværelser – de er helt vilde med IVAR.",
      price: "450",
      link: "https://www.ikea.com/dk/da/p/ivar-skab-fyr-40033763/",
      wishlistID: wishlistIDs[0].ID,
      image: "https://www.ikea.com/dk/da/images/products/ivar-cabinet-pine__0730093_PH156209_S5.JPG"
    },
    {
      title: "Henri Matisse poster",
      description: "Henri Matisse Flowers - Exhibition art",
      price: "255",
      link: "https://www.pstrstudio.com/products/henri-matisse-flowers-exhibition-art-print-collection-poster",
      wishlistID: wishlistIDs[0].ID,
      image: "https://cdn.shopify.com/s/files/1/0277/7572/9799/products/Henri-Matisse-3_600x.jpg?v=1585643742%20600w"
    },
    {
      title: "Söderhamn sofa from IKEA",
      description: "SÖDERHAMN Corner section, Finnsta white",
      price: "1840",
      link: "https://www.ikea.com/dk/da/p/soederhamn-hjornesektion-finnsta-hvid-s69133776/",
      wishlistID: wishlistIDs[0].ID,
      image: "https://www.ikea.com/dk/da/images/products/soederhamn-corner-section__0782267_PE761217_S5.JPG?f=m%20600w,%20https://www.ikea.com/dk/da/images/products/soederhamn-corner-section__0782267_PE761217_S5.JPG?f=s%20500w,"
    },
    {
      title: "Söderhamn sofa from IKEA",
      description: "SÖDERHAMN pouf, Finnsta white",
      price: "959",
      link: "https://www.ikea.com/dk/da/p/soederhamn-taburet-finnsta-hvid-s29134122/",
      wishlistID: wishlistIDs[0].ID,
      image: "https://www.ikea.com/dk/da/images/products/soederhamn-footstool-finnsta-white__0841723_PE713387_S5.JPG"
    },
    {
      title: "Built-in wardrobe",
      description: "Buil-in wardrobe made from IKEA PAX closets. Approx 3 pieces of w: 75 cm each",
      price: "Unknown",
      link: "https://www.ditteblog.dk/2019/06/ikea-hack-diy-guide-til-indbyggede-garderobeskabe-med-pax-og-billy/",
      wishlistID: wishlistIDs[1].ID,
      image: "https://www.ditteblog.dk/wp-content/uploads/2019/05/459F1000-1458-4508-B224-28005308D010.jpg"
    },
    {
      title: "Bench",
      description: "Bench for the hallway with storage space under, either in tiles or in wood",
      price: "Unknown",
      link: "http://mariejedig.com/2018/09/warm-nordic/",
      wishlistID: wishlistIDs[1].ID,
      image: "https://cdn.bloggersdelight.dk/wp-content/blogs.dir/67/files/2018/09/a34594f0-f237-41cc-ae57-661c3b11f46b.jpeg"
    },
    {
      title: "Curtains, Tibast",
      description: "Curtains for the apartment from IKEA",
      price: "Unknown",
      link: "https://www.ikea.com/dk/da/p/tibast-gardiner-2-stk-hvid-10396760/",
      wishlistID: wishlistIDs[2].ID,
      image: "https://www.ikea.com/dk/da/images/products/tibast-curtains-1-pair-white__0888793_PE658050_S5.JPG"
    },
    {
      title: "Wall-mirror, 80*220 cm",
      description: "Wall-mirror for the hallway",
      price: "Unknown",
      link: "https://www.facebook.com/marketplace/item/225808675127813",
      wishlistID: wishlistIDs[2].ID,
      image: "https://scontent-cph2-1.xx.fbcdn.net/v/t1.0-9/p960x960/87827176_10163379577375624_7537953322884399104_o.jpg?_nc_cat=111&_nc_sid=3b2858&_nc_ohc=U2GuSAcAivkAX8nqFpy&_nc_ht=scontent-cph2-1.xx&_nc_tp=6&oh=3b869568c87671f45655bf6dd6674be3&oe=5EF67AE0"
    },
  ]);
};