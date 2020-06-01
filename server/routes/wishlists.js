const router = require('express').Router();
const escape = require("escape-html");
const User = require("../models/User");
const Wishlist = require("../models/Wishlist");
const WishlistLine = require("../models/WishlistLine");

const isAuthenticated = require("../isAuthenticated");

// ###################################### GET WISHLISTS

router.get("/wishlists", isAuthenticated, async (req, res) => {

    try {
        const userWishlists = await Wishlist.query().select().where({
            userID: req.session.user.ID,
            isActive: 1
        });

        if (!userWishlists) {
            return res.status(404).send({
                response: false
            });
        }

        res.status(200).send({
            response: userWishlists
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            response: "Something went wrong, please try again"
        });
    }

});

// ###################################### GET PUBLIC WISHLISTS

router.get("/profile/:userID/wishlists", async (req, res) => {

    const userID = req.params.userID;

    try {
        const userWishlists = await Wishlist.query().select().where({
            userID: userID,
            isPublic: 1,
            isActive: 1
        });

        if (!userWishlists) {
            return res.status(404).send({
                response: false
            });
        }

        res.status(200).send({
            response: userWishlists
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            response: "Something went wrong, please try again"
        });
    }

});

// ###################################### GET SINGLE WISHLIST WITH ITEMS

router.get("/wishlists/:ID", isAuthenticated, async (req, res) => {

    const wishlistID = req.params.ID;

    try {
        const userWishlist = await Wishlist.query().select().where({
            ID: wishlistID,
            userID: req.session.user.ID,
            isActive: 1
        }).limit(1);

        if (!userWishlist[0]) {
            return res.status(401).send({
                response: "User is not authorized"
            });
        }

        const userWishlistItems = await WishlistLine.query()
            .select()
            .innerJoin('Wishlist', 'WishlistLine.wishlistID', '=', 'Wishlist.ID')
            .where({
                'Wishlist.ID': wishlistID,
                'Wishlist.isActive': 1,
                'WishlistLine.isActive': 1
            })
            .whereExists(
                User.query()
                .select(1)
                .whereColumn(
                    'User.ID', req.session.user.ID,
                )
            );

        if (!userWishlistItems) {
            return res.status(404).send({
                response: false
            });
        }

        return res.status(200).send({
            list: userWishlist[0],
            items: userWishlistItems
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            response: "Something went wrong, please try again"
        });
    }
});


// ###################################### GET PUBLIC SINGLE WISHLIST WITH ITEMS

router.get("/profile/:userID/wishlists/:ID", async (req, res) => {
    const userID = req.params.userID;
    const wishlistID = req.params.ID;

    try {
        const userWishlist = await Wishlist.query().select().where({
            ID: wishlistID,
            userID: userID,
            isActive: 1
        }).limit(1);

        if (!userWishlist[0]) {
            return res.status(401).send({
                response: "User is not authorized"
            });
        }

        const userWishlistItems = await WishlistLine.query()
            .select()
            .innerJoin('Wishlist', 'WishlistLine.wishlistID', '=', 'Wishlist.ID')
            .where({
                'Wishlist.ID': wishlistID,
                'Wishlist.isActive': 1,
                'WishlistLine.isActive': 1,
                'Wishlist.userID': userID
            })

        if (!userWishlistItems) {
            return res.status(404).send({
                response: false
            });
        }

        return res.status(200).send({
            list: userWishlist[0],
            items: userWishlistItems
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            response: "Something went wrong, please try again"
        });
    }
});


// ###################################### POST WISHLIST 

router.post("/wishlists/", isAuthenticated, async (req, res) => {

    let {
        name,
        description,
        isPublic
    } = req.body;

    if (!name || !description) {
        return res.status(400).send({
            response: "Please fill out all the required fields"
        });
    }

    try {

        let wishlist = await Wishlist.query().select().where({
            name: name,
            userID: req.session.user.ID
        }).limit(1);

        if (wishlist[0]) {

            if (wishlist[0].isActive === 1) {
                return res.status(400).send({
                    response: "You already have a wishlist with that name"
                });
            }

            const createdReq = await Wishlist.query().update({
                isActive: 1,
                description: description,
                isPublic: isPublic
            }).where({
                ID: wishlist[0].ID
            });

            const createdWishlist = {
                name,
                description,
                isPublic
            };

            return res.status(200).send({
                message: `Wishlist ${name} is successfully reactivated`,
                response: createdWishlist
            });

        }

        let createWishlist = await Wishlist.query().insert({
            name: name,
            description: description,
            isPublic: isPublic,
            userID: req.session.user.ID
        });

        res.status(200).send({
            message: `Wishlist ${name} succesfully created`,
            response: createWishlist
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            response: "Something went wrong, please try again"
        });
    }
});

// ###################################### UPDATE WISHLIST

router.post("/wishlists/:ID", isAuthenticated, async (req, res) => {
    let {
        name,
        description,
        isPublic
    } = req.body;

    const wishlistID = req.params.ID

    if (!name || !description) {
        return res.status(400).send({
            response: "Please fill out all the required fields"
        });
    }

    try {
        const wishlistReq = await Wishlist.query().select().where({
            ID: wishlistID,
            userID: req.session.user.ID
        }).limit(1);

        if (!wishlistReq[0] || wishlistReq[0].isActive === 0) {
            return res.status(401).send({
                response: "User not authorized"
            });
        }

        // TODO: What about duplicate names for wishlists - I'm checking for that in
        // the post wishlist route, but maybe it's stupid to do so...

        const updatedReq = await Wishlist.query().update({
            name: name,
            description: description,
            isPublic: isPublic
        }).where({
            ID: wishlistReq[0].ID
        });

        const updatedWishlist = {
            name,
            description,
            isPublic
        };

        res.status(200).send({
            message: `Wishlist ${name} is succesfully updated`,
            response: updatedWishlist
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            response: "Something went wrong, please try again"
        });
    }
});

// ###################################### DELETE WISHLIST + ITEMS

router.get("/wishlists/:ID/delete/", isAuthenticated, async (req, res) => {

    const wishlistID = req.params.ID

    try {

        const wishListReq = await Wishlist.query().select().where({
            ID: wishlistID,
            userID: req.session.user.ID
        }).limit(1);

        if (!wishListReq[0]) {
            return res.status(401).send({
                response: "User not authorized"
            });
        }

        const trx = await Wishlist.startTransaction();

        try {
            await Wishlist.query(trx).update({
                    isActive: 0
                })
                .where({
                    ID: wishlistID,
                    userID: req.session.user.ID
                });

            await WishlistLine.query(trx).update({
                    isActive: 0
                })
                .where({
                    wishlistID: wishlistID
                })

            await trx.commit();
        } catch (error) {
            console.log(error);
            await trx.rollback();
            throw error;
        }

        return res.status(200).send({
            response: `Succesfully deleted ${wishListReq[0].name}`
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            response: "Something went wrong, please try again"
        });
    }
});

// ###################################### POST WISHLIST ITEM

router.post("/wishlists/:ID/item/", isAuthenticated, async (req, res) => {
    let {
        title,
        description,
        price,
        image,
        link
    } = req.body;

    if (!price || !link || !title) {
        return res.status(400).send({
            response: "Please fill out all the required fields"
        });
    }

    const wishlistID = req.params.ID;

    try {
        const wishlist = await Wishlist.query().select().where({
            ID: wishlistID,
            userID: req.session.user.ID
        }).limit(1);

        if (!wishlist[0]) {
            return res.status(400).send({
                response: "User not authorized"
            });
        }

        const wishlistLine = await WishlistLine.query().select().where({
            wishlistID: wishlistID,
            link: link
        }).limit(1);

        if (wishlistLine[0]) {
            if (wishlistLine[0].isActive === 1) {
                return res.status(400).send({
                    response: "The item already exists"
                });
            }

            const createReq = await WishlistLine.query().update({
                title,
                description,
                price,
                image,
                isActive: 1
            }).where({
                ID: wishlistLine[0].ID
            });

            const createdWishlistItem = {
                title,
                description,
                price: price,
                image: image,
                link: link
            }

            return res.status(200).send({
                message: `Wishlist item ${title} is successfully reactivated`,
                response: createdWishlistItem
            });
        }

        const createdWishlistItem = await WishlistLine.query().insert({
            title: title,
            description: description,
            price: price,
            link: link,
            image: image,
            wishlistID: wishlistID
        });

        return res.status(200).send({
            message: `Wishlist item ${title} is successfully created`,
            response: createdWishlistItem
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            response: "Something went wrong, please try again"
        });
    }
});

// ###################################### UPDATE WISHLIST ITEM

router.post("/wishlists/:wishlistID/item/:ID", isAuthenticated, async (req, res) => {
    let {
        title,
        description,
        price,
        link,
        image
    } = req.body;

    if (!price || !link || !title) {
        return res.status(400).send({
            response: "Please fill out all the required fields"
        });
    }

    const wishlistID = req.params.wishlistID;
    const ID = req.params.ID;

    try {
        const wishlist = await Wishlist.query().select().where({
            ID: wishlistID,
            userID: req.session.user.ID
        }).limit(1);

        const wishlistLine = await WishlistLine.query().select().where({
            wishlistID: wishlistID,
            ID: ID
        }).limit(1);

        if (!wishlist[0] || !wishlistLine[0] || wishlistLine[0].isActive === 0) {
            return res.status(400).send({
                response: "User not authorized"
            });
        }

        const updatedReq = await WishlistLine.query().update({
            title,
            description,
            price: price,
            link: link,
            image: image,
            isActive: 1
        }).where({
            ID: wishlistLine[0].ID
        });

        const updatedWishlistItem = {
            title,
            description,
            price: price,
            link: link
        }

        console.log(updatedWishlistItem);

        return res.status(200).send({
            message: `Wishlist item ${title} is successfully updated`,
            response: updatedWishlistItem
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            response: "Something went wrong, please try again"
        });
    }
});


// ###################################### DELETE WISHLIST ITEM

router.get("/wishlists/:wishlistID/item/:ID/delete", isAuthenticated, async (req, res) => {

    const wishlistItemID = req.params.ID;
    const wishlistID = req.params.wishlistID;

    try {

        const deleteWishListLineReq = await WishlistLine.query().update({
            isActive: 0
        }).where({
            ID: wishlistItemID,
            wishlistID: wishlistID
        });

        return res.status(200).send({
            response: "Successfully deleted item from wishlist"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            response: "Something went wrong, please try again"
        });
    }
});

module.exports = router