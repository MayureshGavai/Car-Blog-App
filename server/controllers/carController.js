require('../models/database');
const category = require('../models/Category');
const Blog = require('../models/Blog');

// Get Homepage

exports.homepage = async(req, res) => {
    try{
        const limitNumber = 5;
        const limitNumber1 = 4;
        const categories = await category.find({}).limit(limitNumber);
        const latest = await Blog.find({}).sort({_id: -1}).limit(limitNumber1);
        const electric = await Blog.find({ 'category': 'Electric'}).limit(limitNumber1);
        const luxury = await Blog.find({ 'category': 'Luxury'}).limit(limitNumber1);
        const sports = await Blog.find({ 'category': 'Sports'}).limit(limitNumber1);

        const car = { latest, electric, luxury, sports };


        res.render('index', { title: 'Car Blog - Home', categories, car});
    }catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }

}




// Get /categories
// category Page

exports.exploreCategories = async(req, res) => {
    try{
        const limitNumber = 20;
        const categories = await category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Car Blog - Categories', categories});
    }catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }

}



// Get /categories/:id
// category Page by id

exports.exploreCategoriesByID = async(req, res) => {
    try{

        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoriesById = await Blog.find({'category': categoryId }).limit(limitNumber);
        res.render('categories', { title: 'Car Blog - Categories', categoriesById});
    }catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }

}



// Get /explore-latest
// explore-latest page

exports.exploreLatest = async(req, res) => {
    try{

        const limitNumber = 20;
        const blog = await Blog.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', { title: 'Car Blog - Explore Latest', blog});
    }catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }

}

// Get /about us
// About us page

exports.aboutus = async(req, res) => {
    try{
        res.render('about',{title: 'Car Blog - About Us'} );
    }catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


// Get /contact
// Contact page

exports.contact = async(req, res) => {
        res.render('contact',{title: 'Car Blog - Contact'} );
}


// Get blog/id
// Blog Page

exports.exploreBlog = async(req, res) => {
    try{
        let blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        res.render('blog', { title: 'Car Blog - Blog', blog});
    }catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }

}

// Post /search
// Search Page

exports.searchBlog = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      let blog = await Blog.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
      res.render('search', { title: 'Car Blog - Search', blog } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
    
}


// Get /submit-blog
// Submit Page

exports.submitBlog = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
      res.render('submit-blog', { title: 'Car Blog - Submit Blog', infoErrorsObj, infoSubmitObj } );
}

// Post /submit-blog
// Submit Page

exports.submitBlogOnPost = async(req, res) => {

    try {
        
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No Files where uploaded');
        }else{

            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath =  require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.satus(500).send(err);
            })
        }


        const newBlog = new Blog({
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            article: req.body.article,
            image: newImageName
        });

        await newBlog.save(); 

        req.flash('infoSubmit', 'Blog has been added.')
        res.redirect('/submit-blog');
    } catch (error) {
        req.flash('infoErrors', error)
        res.redirect('/submit-blog');
    }

}


















// function for inserting category data in database


// async function insertDymycategoryData(){
//     try{
//         await category.insertMany([
//             {
//                 "name": "Hatchback",
//                 "image": "hatchback.jpg"
//             },
//             {
//                 "name": "Electric",
//                 "image": "ev.jpg"
//             },
//             {
//                 "name": "Sedan",
//                 "image": "sedan.jpg"
//             },
//             {
//                 "name": "Compact Suv",
//                 "image": "compact_suv.jpg"
//             },
//             {
//                 "name": "Suv",
//                 "image": "suv.jpg"
//             },
//             {
//                 "name": "Muv",
//                 "image": "muv.jpg"
//             },
//             {
//                 "name": "Pickup",
//                 "image": "pickup.jpg"
//             },
//             {
//                 "name": "Luxury",
//                 "image": "luxury.jpg"
//             },
//             {
//                 "name": "Offroad",
//                 "image": "offroad.jpg"
//             },
//             {
//                 "name": "Convertable",
//                 "image": "convertable.jpg"
//             },
//             {
//                 "name": "Sports",
//                 "image": "sports.jpg"
//             }
//         ]);
//     }catch(error){
//         console.log('err', +error);
//     }
// }

// insertDymycategoryData();





// function for inserting Blog data into database

// async function insertDymyBlogData(){
//     try{
//         await Blog.insertMany([
//             {
//                 "title": "Mercedes-Benz EQS 53 AMG 4MATIC+ First Drive Review",
//                 "author": "Bilal Ahmed Firfiray",
//                 "category": "Electric",
//                 "article": "Not so long ago, if a Three-Pointed Star wore an AMG badge, it had an angry, rumbling V8 under the hood. But here we are with the all-electric AMG. It is the second car under the EQ sub-brand, and the EQS is Mercedes-Benz’s way of showing the world what our ‘electric future’ is capable of.\n\n\n\n    Three screens! So basically, all it has are screens for a dashboard. Occupying the centre space is the largest of the three with all the physical buttons pushed near the armrest on the centre console. Boasting the latest MBUX interface, there are controls on the steering wheel which are no different to operate from what you get in, say, the new C-Class. An interesting feature about the third screen on the dash is that it gets activated only when someone is sitting in the front passenger seat. This touchscreen also has the same interface that you get in the middle. Meanwhile, the driver’s display comes with a plethora of configurations.\n\n  Although it’s quite low-slung, the AMG EQS is still an easy car to get in and out of. We were also surprised to see how easy the EQS is to manoeuvre around town and it’s not intimidating to drive either, but more on that later. It’s an AMG and hence with the familiar-looking steering wheel (familiar because it's the same as on the C300d) comes two circular dials for drive modes, like the ones you get on AMG GT. Plus, everything inside is wrapped in rich Nappa leather. Behind the wheel, the rear visibility isn’t good and you can neither see the end of the sloping bonnet over the tall dashboard. Now, with the lack of a physical gearbox, the centre console looks like it is floating in the air with a large spacious compartment below it. Even the centre console has two cup holders, a wireless charger, and more space for knick-knacks.\n\n ",
//                 "image": "mercedes-benz-amg-eqs.jpg"
//             },
//             {
//                 "title": "Audi A4 Gets New Features and Colours Along With A Price Hike",
//                 "author": "Ansh",
//                 "category": "Luxury",
//                 "article": "The Audi A4 has been given two new colours and features. The German carmaker has added Manhattan Grey and Tango Red to the sedan’s colour options and has given the Audi A4 Technology variant a new flat-bottom steering wheel and a 19-speaker, 755W, B&O 3D sound system.\n\n  The Audi A4 comes with a 2-litre turbocharged diesel engine – coupled with a 12V mild hybrid system – making 190PS and 320Nm. This combination is paired with a seven-speed dual-clutch automatic (DCT). It features a 10.1-inch touchscreen infotainment system, an all-digital instrument cluster, three-zone climate control, ambient lighting, wireless phone charging and powered front seats.",
//                 "image": "audi-a4.jpg"
//             },
//             {
//                 "title": "Tata Punch Gets A New Camo Edition",
//                 "author": "Rohit",
//                 "category": "Hatchback",
//                 "article": "Tata Motors has launched the Punch Camo edition, making it the second SUV after the Harrier to get the treatment. It’s based on the mid-spec Adventure and Accomplished trims and is being offered in a total of eight variants. Until now, the Kaziranga edition was the only special edition available with the Punch.\n\n  For the extra dough, the limited edition Punch gets a new Foliage Green shade with an optional black or white roof, 16-inch blacked-out alloy wheels, and black treatment for the chrome bits. It also sports ‘Camo’ badges on the front fenders.\n\n  Step inside and you will notice an all-black cabin with camouflaged seat upholstery and green trim bits on the dashboard and door pads. The Punch special edition features a seven-inch touchscreen system, cruise control, push-button start/stop, and a six-speaker music system. Compared to the top-spec Creative trim, the Camo edition misses out on features such as auto AC, rain-sensing wipers, and a semi-digital instrument cluster. ",
//                 "image": "tata-punch.jpg"
//             },
//             {
//                 "title": "Volvo India Lineup Updated For MY23, Pure ICE Models Booted Out",
//                 "author": "Sonny",
//                 "category": "Luxury",
//                 "article": "The Volvo XC40 gets a special discounted price of Rs 43.2 lakh (ex-showroom) for the festive season. Meanwhile, prices for the mild-hybrid XC60 remain unchanged and the S90 has gotten pricier by Rs 1 lakh.\n\n  The mild-hybrid variants of these Volvo cars feature a 2-litre turbo-petrol engine and a 48-volt electric motor for improved fuel economy and reduced emissions. In the XC40 mild-hybrid variant, the powertrain is tuned to an output of 197PS and 300Nm while the XC90 mild-hybrid makes 300PS and 420Nm.\n\n   Meanwhile, the XC60 and S90 mild-hybrid powertrain is rated at 250PS and 350Nm. All these models have an eight-speed automatic transmission, but it is important to note that the XC90 has all-wheel drive while the XC40 is front-wheel drive.\n\n  The updated XC40 now looks the same as its all-electric version. Its new B4 Ultimate mild-hybrid variant gets a few feature updates too. It is now equipped with Blind Spot Information System (BLIS) with rear cross-traffic alert, collision mitigation support, active noise control and an advanced air purifier. Other features include adaptive cruise control, lane-keeping assist, an Android-powered infotainment system and a 14-speaker Harman Kardon sound system.",
//                 "image": "volvo-launch.jpg"
//             },
//             {
//                 "title": "Tata Yodha Pickup Latest Update",
//                 "author": "Tata Company",
//                 "category": "Pickup",
//                 "article": "The Yodha introduced in the middle of 2017 is a superior product than the prior generation Xenon. Yodha is designed and developed keeping in mind the rapidly evolving customer needs of modern transportation. Yodha offers higher payload than the Ace range of compact trucks, and customers looking to upgrade from Ace or some of them from even smaller vehicles, the Yodha pickup is the most suitable vehicle.\n\n  Mahindra is the market leader in this segment with the popular Bolero Pickup. Tata Motors is a challenger brand trying to get a strong number 2 position. While the company has several products such as 207 and Xenon pickup in this segment offering a variety of loads options and applications to customers, Yodha is a next-generation product from Tata Motors.\n\n Yodha comes in single and crew cab options in 4x4 and 4x2 variants, with rated payload options of 1140, 1,250 kg &amp; 1500 kgs, for a wide range of commercial applications. The modern styling with SUV-type tough appearance and well-appointed, comfortable interiors makes Yodha a modern pickup. Yodha gets bigger 16-inch radial tyres, and a proven driveline consists of 4-cylinder 2956 cc engine with 85 HP of power @3000 rpm and 250 of torque @1000-2000 rpm across variants. For ease of driving Yodha comes with standards power-steering, the suspension offers comfort and flexibility with 6 semi-elliptical springs and 9 leaves leaf springs.\n\n Tata Motors has not only banking on the looks of Yodha but also promising lower operating costs-critical for a transporter, higher mileage and much less total cost of ownership ensuring the customer earns more per trip.\n\n   In the just concluded Auto Expo 2020, Tata Motors has introduced the BSVI Yodha 1700 with additional features, a higher power engine and more loading space.",
//                 "image": "tata-yodha.jpg"
//             },
//             {
//                 "title": "i20 Wins The Prestigious 2021 Indian Car Of The Year Award",
//                 "author": "Hyundai Company",
//                 "category": "Hatchback",
//                 "article": "Adding yet another feather to its well-adorned cap, the all-new Hyundai i20 has walked away with the top honour at the Indian Car of the Year 2021\n\n  The third-gen Hyundai i20 has bagged the prestigious title of the ‘Indian Car of the Year 2021’ (ICOTY 2021). Hyundai i20 won the award by fiercely beating its rivals with an aggregate score of 104 points. The vehicles in second and third place got 91 and 78 respectively.\n\n  Ever since its launch in the Indian market in November last year, the new i20 has been consistently ranked among the best selling models in the country. The car is based on Hyundai's Sensuous Sportiness design language and boasts of many first-in-class and best-in-class features.\n\n  The exteriors of the new i20 are striking. The prominent LED projector headlamps, Parametric jewel pattern grille, front projector fog lamps, and Z-shaped LED tail lamps are the defining characteristics of this truly premium hatchback. Further adding a robust dose of design sophistication are features such as the electric sunroof, shark fin antenna, and R16 diamond-cut alloy wheels.\n\n Hyundai has equipped the new i20 with several first-in-class features such as a tyre pressure monitoring system (highline) with a display on the MID, Oxyboost air purifier with air quality indicator, OTA map updates, eco coating, emergency stop signal, hill assist control (HAC), and multiple-device Bluetooth connectivity. In addition, the all-new i20 also enjoys the distinction of having many best-in-class features, including six airbags, a 26.03 cm HD touchscreen infotainment and navigation system, a wireless charger with a cooling pad, a digital cluster with TFT multi-information display (MID), a front sliding armrest, and a Bose premium 7-speaker system.",
//                 "image": "i20.jpg"
//             },
//             {
//                 "title": "All-new SKODA OCTAVIA",
//                 "author": "Prem",
//                 "category": "Sedan",
//                 "article": "While the Octavia continues to enjoy cult status among enthusiasts, the new generation aims to appeal to the premium sedan buyers in India.\n\n  For all Octavia fans, the wait is finally over. The all-new Skoda Octavia has made it to Indian shores in the Style and top-end L&K trim. The new generation looks crisp, posh, and so very luxurious. Up front, the focal point of attention is the new grille which now sits lower down and comes flanked by Bi-LED headlamps. Double-L shaped DRLs have their own charm and the chrome-surround LED fog lamps on the L&K are tastefully done.\n\n  Skinning on the flanks and fenders is tight and this, coupled with lots of cuts and creases, gives the all-new Octavia a chiselled appearance. The Style variant gets 43.18cm silver finish alloys whereas the top L&K trim comes equipped with similar size machine-cut alloy wheels. At the rear, crystalline elements in the tail lamps and prominent Skoda branding add to the overall visual appeal of the Octavia. All in all, Skoda has successfully struck a fine balance between sportiness and luxury with the all-new Octavia that is loved by enthusiasts and the corporate crowd alike.",
//                 "image": "octavia.jpg"
//             },
//             {
//                 "title": "Maruti Wagon R Latest Update",
//                 "author": "John Pinto",
//                 "category": "Hatchback",
//                 "article": "Maruti Wagon R Price: The compact hatchback retails between Rs 5.48 lakh and Rs 7.20 lakh (ex-showroom Delhi).\n\n  Maruti Wagon R Variants: The Maruti Wagon R is offered in four trims: LXi, VXi, ZXi, and ZXi+. CNG is also available with the LXi and VXi trims.\n\n  Maruti Wagon R Engine and Transmission: It comes with two petrol engine options: a 1-litre unit (making 67PS and 89Nm) and a 1.2-litre one (making 90PS and 113Nm). Both engines come paired with a five-speed manual and have an optional five-speed automatic. The CNG kit is available with the 1-litre engine (making 57PS and 82.1Nm), mated with a five-speed manual transmission.\n\n  Maruti Wagon R Features: Features onboard the hatchback include a four-speaker music system, seven-inch touchscreen display, steering-mounted audio and phone controls, and 14-inch alloy wheels.\n\n  Maruti Wagon R Safety: Passenger safety is ensured by hill-hold assist (only on AMT models), dual front airbags, ABS with EBD and rear parking sensors.",
//                 "image": "wagonr.jpg"
//             },
//             {
//                 "title": "Mahindra Thar Performance Review",
//                 "author": "Shanks",
//                 "category": "Offroad",
//                 "article": "A new generation brings with it more versatility. The Thar is now offered with a 2.0-litre petrol engine that makes 150PS and 320/300Nm of torque (AT/MT). The diesel is a new 2.2-litre unit producing 130PS and 300Nm of torque. Both engines are turbocharged and available with a 6-speed manual transmission as standard with the option of an AISIN 6-speed automatic. A rear biased 4x4 drivetrain comes as standard.\n\n  Diesel Manual: The one big difference you first notice is the refinement. The new diesel is extremely smooth at start up and vibrations are controlled very well too. If you drive an old Thar, this one is a giant leap ahead in the NVH department. The controls are light and easy to use as well. The steering is about as light as it is in the XUV300 and the clutch throw is neither too long nor too heavy to manage traffic. Even the gear lever is smooth to use and slots in without a fuss. That’s a big relief compared to the old one which had different time zones for each gear. What also stands out is the low rev torque. Second gear, 900rpm at 18kmph on a sharp incline and the Thar shows no signs of struggle! It climbs with joy inducing ease which is a good sign for its off-road ability. The motor itself isn’t too vocal. Yes, you can tell it’s a diesel and it does get loud after 3000rpm but the noise doesn’t boom or reverberate inside the cabin. Once you’re cruising in top gear, the engine noise is negligible and the car feels relaxed.\n\n  Diesel Automatic: The 6-speed automatic transmission of the Thar feels similar to use as the XUV500 AT. It’s a torque converter and is reasonably responsive for regular use. With part throttle, gear changes can be felt a little and hard downshifts will be accompanied with a head nod. It’s not lightning quick by any means but gets the job done and makes daily drives hassle free. Yes, you do get a Tiptronic-style manual mode as well but no paddle shifters.\n\n  Petrol Automatic:  What stands out the most in the petrol is its refinement. If the vibrations at startup/while driving hard are acceptable in the diesel, they’re negligible in the petrol. It’s not a dull engine either. Sure, there’s some turbo lag but it doesn’t feel lazy and picks up pace very quickly. Throttle response is good too and it’s a reasonably rev happy engine. The automatic transmission also feels smoother here than in the diesel, though the difference is marginal.",
//                 "image": "thar.jpg"
//             },
//             {
//                 "title": "Force Gurkha Exterior Review",
//                 "author": "Cardekho",
//                 "category": "Offroad",
//                 "article": "While it may not be evident in the first look, the 2021 Gurkha shares no body or platform part with the older SUV. What remains true even today is the boxy shape of the Gurkha which even Force admits (unlike some) is inspired by the Mercedes G-Wagen. The placement of the turn indicators, round headlamps and the tall body are the elements that keep the 2021 Gurkha true to its design heritage. It continues to feature metallic bash plates as well. That said, the elements are a lot more polished and modern.\n\n  The front gets full-LED headlamps along with jewel-like LED DRLs. The grille proudly features the Gurkha name, instead of the round Force Motors logo. From the side, you still get the snorkel, the only passenger car in India to get it as a factory fitment, that helps the Gurkha achieve a water wading depth of 700mm. The large ORVMs feature a Khukri emblem, the fighting knife of the mighty Gurkha warriors, and the rest of the side is dominated by a large single glass window for the rear passengers. The 4x4x4 badge has been retained and remains a marketing spiel hinting towards the terrains the Gurkha can conquer - desert, water, forest and mountains.\n\n  In terms of dimensions, the new 4116mm length is now longer by 124mm but the 1812mm width is now shorter by 8mm. The height and the wheelbase remain the same at 2075mm and 2400mm respectively. At the back, the tough-looking bumper, ladder and the spare tyre help it look brute. However, the roof rack, ladder and wheel along with the tyres are accessories that customers can opt for. Everything else you see on the car is stock. On the road, the presence of the Gurkha is unmistakable as it stands tall and loud, especially in the new funky colours like red and orange. Other colours are white, green and grey.",
//                 "image": "gurkha.jpg"
//             },
//             {
//                 "title": "Mahindra Alturas G4 Latest Update",
//                 "author": "Mahindra Company",
//                 "category": "Suv",
//                 "article": "Mahindra Alturas G4 Price: Prices for the SUV range from Rs 28.88 lakh to Rs 31.88 lakh (ex-showroom, Delhi).\n\n  Mahindra Alturas G4 Variants: It can be had in two trims: 2WD and 4WD.\n\n  Mahindra Alturas G4 Seating Capacity: The Alturas G4 can seat up to seven people.\n\n  Mahindra Alturas G4 Engine and Transmission: Propulsion duties are carried out by a 2.2-litre four-cylinder diesel engine (180PS/420Nm), paired with a 7-speed automatic.\n\n  Mahindra Alturas G4 Features: Mahindra offers the Alturas G4 with an 8-inch infotainment system, a sunroof, cruise control, dual-zone climate control, and an 8-way adjustable driver’s seat.\n\n  Mahindra Alturas G4 Safety: The SUV’s safety kit consists of ABS with EBD, up to nine airbags and ISOFIX child anchorages.",
//                 "image": "mahindra-alturas.jpg"
//             },
//             {
//                 "title": "Toyota Fortuner Verdict",
//                 "author": "Toyota Company",
//                 "category": "Suv",
//                 "article": "The Toyota Fortuner’s dominance in the market and on the road has never been questioned. Its persona of being associated with the ministers of the country has given its white colour extra importance on the road. Keeping all of this in mind, Toyota launched the Legender variant along with the 2021 facelift model. It packs aggressive looks, added convenience features, a 2WD diesel powertrain and most importantly - it is only available in a white dual-tone body colour. However, it is the most expensive Fortuner variant, more expensive than even the 4WD.\n\n  The Legender feels thoroughly impressive in the way that it looks, it drives, the comfortable ride and the added features. In a nutshell, all the changes turn out to be improvements that new owners will appreciate. And yes, apart from the weird miss of the premium sound system, everything feels in place for the Legender to be the ideal Fortuner for an urban family. However, that is before the price comes into the picture.\n\n  The 4x2 diesel automatic Fortuner is priced at Rs 35.20 lakh. And at Rs 37.79 lakh, you pay Rs 2.6 lakhs more for the 4WD automatic. Acceptable. However, the Legender, a 2WD SUV, at Rs 38.30 lakh, is the most expensive Fortuner variant. It’s an absurd Rs 3 lakh more expensive than the standard 4x2 automatic and even Rs 50,000 more expensive than the 4WD Fortuner. And given its price, it's hard to justify the jump over the standard SUV for a handful of features and differently styled bumpers. If you have the extra money and absolutely love the Lexus-inspired looks, the Legender does make sense. Otherwise, the standard 2WD Fortuner remains the pick here.",
//                 "image": "fortuner.jpg"
//             },
//             {
//                 "title": "Maruti Suzuki XL6 Interior Review",
//                 "author": "Josh",
//                 "category": "Muv",
//                 "article": "The 2022 XL6's cabin remains unchanged except for a few details. You get a new touchscreen infotainment system, albeit the screen size remains the same at 7 inches. However, the revamped graphics and software make the system easy to navigate. The touch response is snappy as well. Yes, we were a bit disappointed by the fact that the screen size remained the same. But the reason for that is the fact that the screen space is sandwiched between the centre air vents and adding a larger screen would have resulted in Maruti needing to redesign the whole dashboard.\n\n  Besides that, the cabin remains unchanged. In the top two variants, you get leather upholstery which looks premium. What's not so premium, however, is the cabin quality. Everywhere you touch or feel there are hard shiny plastics. Overall the XL6's cabin lacks the sense of luxury that you get in something like the Kia Carens.\n\n  In terms of comfort, the XL6 still excels. The front two rows are comfortable with more than enough space, and the seats are supportive as well. But the biggest surprise is the third row. There is just about enough headroom, but knee and foot room impresses and under-thigh support is good. The fact that you can recline the backrest makes this one of the best third rows to spend time in.\n\n  The XL6's cabin is very practical too, with good storage space options for all three rows. What disappoints, however, is that you get only one USB charging port in this six-seater. When it comes to boot space the XL6 impresses not only with the seats folded but even with the third row up.",
//                 "image": "xl6.jpg"
//             },
//             {
//                 "title": "2022 Maruti Ertiga ZXi+ Variant Analysis: Worth Spending The Premium For The Top Variant?",
//                 "author": "Rohit",
//                 "category": "Muv",
//                 "article": "Although not much is different between the facelifted Maruti Ertiga’s top-spec ZXi+ and the previous trim in terms of looks, the former does get a healthier safety net. It is priced at a premium of almost a lakh over the previous ZXi.\n\n  The primary reason why one should consider upgrading over the ZXi to the ZXi+ trim is for the inclusion of two more airbags and a reversing camera. It also gets feel-good as well as some functional features such as auto-headlights, a leather-wrapped steering wheel, and power-folding ORVMs.\n\n  One aspect where Maruti could have done a bit better is in terms of safety. Being a people mover, we think the Ertiga should have been provided with six airbags in this trim instead of the four. Also, while introducing the facelifted Ertiga, we believe Maruti should have offered it with LED headlights with LED DRLs and some premium features like ventilated front seats in at least the top-spec ZXi+ trim.",
//                 "image": "ertiga"
//             },
//             {
//                 "title": "Tata Nexon EV Max Becomes First Electric Car To Cross Umling La Pass",
//                 "author": "Shreyash",
//                 "category": "Electric",
//                 "article": "The Nexon EV Max has become the first electric vehicle to cross the world's highest motorable road Umling La, which is located in Ladakh at 19,024 feet above the sea level.Tata says a team of drivers set out with the electric subcompact SUV from Leh and arrived at Umling La on September 18, 2022, thus inscribing its name in the India Book of Records.The Nexon EV Max is built on Tata's Ziptron EV architecture. Unlike ICE vehicles, which face difficulties with high altitude and thinner air, the performance of an electric car seems to be unaffected at such conditions.\n\n  The Nexon EV Max houses a 40.5kWh battery pack that is paired with an electric motor (both of which are IP67 rated) which makes 143PS of power and 250Nm of peak torque. The EV can complete the 0-100kmph sprint in under nine seconds.\n\n  Commenting on this achievement, Mr. Vivek Srivatsa, Head, Marketing, Sales and Service Strategy, Tata Passenger Electric Mobility Ltd. said “We are thrilled to witness the Nexon EV MAX achieving this remarkable milestone which further demonstrates its capabilities. All Nexon EV MAX users have the freedom to undertake regular and uninterrupted long-distance travel with superior ride & handling. Not only it offers more range and power, but also supports faster charging while improving the overall driving efficiency and further providing an uncompromised EV ownership experience. Besides, it has an inherent advantage of high altitude, thinner air, lower pressure having no impact on its performance. This has been well established with this milestone and such achievements will further encourage the Indian customer to #EvolveToElectric.”",
//                 "image": "nexon-ev.jpg"
//             },
//             {
//                 "title": "Maruti Grand Vitara Expected Prices: Will It Be The Most Affordable AWD SUV In India?",
//                 "author": "Sonny",
//                 "category": "Suv",
//                 "article": "All its technical details are already known as are some of the prices of its Toyota Hyryder sibling\n\n  The Maruti Suzuki Grand Vitara is due for a launch soon, and it is the most premium homegrown offering the brand has had to offer. All of its details have been revealed, including the variant-wise features, and we’ve driven it too.\n\n  While Maruti has maintained a foothold in the compact SUV segment with the S-Cross, it was never a serious contender to the dominance of the Hyundai Creta. The all-new Grand Vitara, co-developed with the Toyota Urban Cruiser Hyryder, is set to change that.\n\n  The Grand Vitara will be offered with the choice of a mild-hybrid petrol unit and a strong-hybrid petrol one, both featuring a 1.5-litre engine. The mild-hybrid gets the choice of a five-speed manual or a six-speed automatic. Maruti is also offering the mild-hybrid engine with an all-wheel-drive option, limited to the manual transmission.\n\n  The self-charging hybrid powertrain uses an e-CVT and has a combined peak power output of 116PS. Its star attraction is the claimed fuel economy of 27.97kmpl.The premium for the strong-hybrid variant over the mild-hybrid petrol-automatic is expected to be around Rs 2.5 lakh. Based on other Maruti models with the mild-hybrid petrol powertrains, the automatic option is expected to attract a premium of Rs 1.5 lakh.",
//                 "image": "grandvitara.jpg"
//             },
//             {
//                 "title": "Honda City Hybrid Fuel Efficiency: Claimed vs Real",
//                 "author": "Rohit",
//                 "category": "Sedan",
//                 "article": "We put the City Hybrid through our usual efficiency run to see if it can match Honda’s impressive claim of 26.5kmpl\n\n  Honda introduced the City e:HEV in May 2022 as the most affordable mass-market hybrid car in India. While it has since lost that title to the new Toyota Hyryder, it is still one of the most frugal models on sale. The sedan is offered with a 1.5-litre petrol engine, an electric motor, a motor generator and a small Li-ion battery pack. The self-charging hybrid system automatically switches between three modes: pure EV, hybrid, and engine-only.\n\n  With a unit of the City Hybrid in our test fleet, we put it through our fuel efficiency runs to check how true it stays to the carmaker’s claims.If you plan on driving the City Hybrid primarily within the city, expect it to return around 21kmpl. For those frequently travelling on highways, fuel efficiency will likely go up by approximately 1.5kmpl. However, if you intend on using it within city traffic and on the highway in equal measure, expect fuel efficiency to hover just above the 21kmpl mark.",
//                 "image": "hondacity.jpg"
//             },
//             {
//                 "title": "The Ioniq 5, Hyundai's Upcoming Electric Vehicle, Was Spotted Testing On Indian Roads",
//                 "author": "Shreyash",
//                 "category": "Electric",
//                 "article": "The test mule was spied testing in Chennai, launch later this year\n\n  The electric car industry in India is gaining popularity among buyers, and as a result, Hyundai is planning to launch its Ioniq 5 EV in India later this year. The Ioniq 5 will be Hyundai's second EV offering, following the Kona Electric. The Ioniq 5 was recently spotted testing on Chennai roads, providing us a peek of its side profile and hinting at its impending release.\n\n  The Ioniq 5 in India will look identical to the model sold overseas. It has a sleek silhouette and sharp lines featuring a neo-retro design.Internationally, the Ioniq 5 is available with two battery pack options: standard and long range.Its four powertrain options are a 325 PS electric motor with an optional AWD drivetrain, standard 235PS AWD, long range 229PS 2WD, and 170PS standard 2WD. In India, we still don't have any confirmation on the powertrain options, but Hyundai should offer the optional AWD like Kia EV6.\n\n  The 350kW DC charger is capable of charging the Ioniq 5 from 0 to 80 percent in under 18 minutes, while the smaller 50kW DC takes 43.5 minutes to recharge the smaller battery pack, and around 56.6 minutes to level up the larger battery pack.",
//                 "image": "ioniq5.jpg"
//             },
//             {
//                 "title": "Hyundai Creta, Kia Seltos, And Mahindra Scorpio Classic’s Waiting Period In Top 20 Indian Cities",
//                 "author": "Tarun",
//                 "category": "Compact Suv",
//                 "article": "The Taigun is the earliest available compact SUV.\n\n  The compact SUV segment, currently comprising six cars, will soon get two additions in form of the Toyota Hyryder and Maruti Grand Vitara. This segment is quite popular and offers SUVs in the Rs 10-20 lakh range.\n\n  The Hyundai Creta sees a massive 8-9 month waiting period in Delhi. Those living in the capital can check with Gurugram, Noida, and Faridabad dealers as they have a less wait time. On an average, the SUV demands a waiting period of around three months.\n\n  Kia Seltos sees the highest waiting period in Delhi and buyers can visit other cities in the NCR for a quicker delivery. In some cities, the Creta is available earlier and vice versa. Since both of them share the underpinnings and powertrains, you can opt for whichever is available the earliest.\n\n  Mahindra Scorpio Classic commands an average waiting period of three months. In cities like Chandigarh, Pune, and Thane, it goes up to five months.\n\n  The Volkswagen Taigun is the quickest available compact SUV here, with an average waiting period of a month. In Gurugram, you can actually get it in just two weeks, but it may take up to three months in Thane and Mumbai.",
//                 "image": "waiting.jpg"
//             },
//             {
//                 "title": "Volkswagen Taigun Completes Its First Year In India, Here's A Short Recap",
//                 "author": "Sonny",
//                 "category": "Compact Suv",
//                 "article": "It has become pricier and gets a few more features as standard than it did at the time of launch.\n\n  The Volkswagen Taigun has now been on sale in India for a full year. It is the brand’s first locally made compact SUV offering and its star product since the discontinuation of the Polo hatchback. The Taigun is one of the smallest cars in its segment but also the priciest, mainly due to its European design, premium features and performance-oriented drivetrains. It has a lot in common with the Skoda Kushaq, such as the MQB A0-IN platform and the two turbo-petrol engines - the 115PS, 1-litre TSI and the 150PS, 1.5-litre TSI.\n\n  One of the biggest changes for the Taigun since its launch has been its price tag. These days all carmakers are clear to point out that the prices announced at a launch are only the introductory rates and will be going up. In the case of the Volkswagen compact SUV, the prices were hiked in two big jumps.Given that the Volkswagen Taigun was pricey out of the gate, it makes sense that its rates have gone up by less than a lakh in its first year. The 1-litre TSI and 1.5-litre TSI engines get the choice of a six-speed manual transmission. Expectedly, the biggest hike can be seen in the entry variant, while the mid-spec Highline is the least affected. The top trims have gotten pricier by around Rs 80,000.\n\n  The feature list of the Taigun has not been as volatile as that of its Skoda cousin, but it has undergone some changes in its first year. Volkswagen updated the SUV to be equipped with auto idle start-stop and a tyre pressure monitoring system as standard. These features were previously limited to the Topline and GT trims only.A minor but successful change was the update to the interior of the Taigun GT variants. At launch, all GT trims came with Cherry Red inserts on the dashboard which are now offered only if the buyer chooses the Cherry Red exterior paint as well. Else, all GT models come with gloss grey inserts.",
//                 "image": "taigun.jpg"
//             },
//             {
//                 "title": "Here Are The Top 5 Differences Between The 5-Door Versions Of The Maruti Jimny And Mahindra Thar",
//                 "author": "Tarun",
//                 "category": "Offroad",
//                 "article": "Both the off-roaders are due to arrive in 2023 and will be more practical than their three-door versions\n\n  Recently, the five-door version of the Maruti Jimny made a spy debut in India. With that coming and even Mahindra readying the Thar’s more practical version, the competition will be tough.Suzuki sells the three-door Jimny globally, which is already a very popular model. In India, we have the three-door Thar which is also performing decently, considering that it’s a lifestyle vehicle.The three-door Jimny is around 3.5-metres long, while the Thar is almost four metres. So, the five-door version of the Jimny is likely to be as long as the current three-door Thar. As for the five-door Thar, it will be based on the Scorpio N’s platform and is expected to be around 4.5-metres long. So yes, the five-door Thar will be much longer than the Jimny.\n\n  As for the Jimny, it will continue with this engine and might additionally get the 140PS 1.4-litre BoosterJet turbo-petrol engine as well. There won’t be any diesel engine on offer here. In case of transmissions, it should get a 5-speed manual along with a new 6-speed torque converter automatic, which you see on bigger Maruti models today\n\n  The same powertrains will continue with the five-door version, but the engine tuning is expected to be higher. Here, you’ll have the option of a diesel engine which will be missed in the Jimny. Transmissions for the five-door Thar will include manual and automatic transmissionsIn case of the drivetrains, both of them will get 4WD with a low-range gearbox, but the Thar might get the option of 2WD (rear-wheel drivetrain) as well.\n\n  The Thar currently retails from Rs 13.53 lakh to Rs 16.03 lakh (ex-showroom Delhi). The five-door version is expected to demand a premium of Rs 1-2 lakh over the corresponding variants. Its top-end variant could stretch close to around Rs 20 lakh (ex-showroom). In case of the Maruti Jimny, it’s expected to be priced right from Rs 10 lakh, which would make it the most affordable off-roader. The Jimny range could top out around Rs 16 lakh, which would still make it a lot more affordable than the Thar.",
//                 "image": "jimmyvsthar.jpg"
//             },
//             {
//                 "title": "The Classic Boosts Scorpio's Sales, First Month Sales Analysis",
//                 "author": "Ansh",
//                 "category": "Suv",
//                 "article": "The previous generation Scorpio’s sales have nearly doubled since it received a facelift.\n\n  Scorpio Classic registered total sales of 7,056 units in August 2022.The SUV has gotten some updates over its previous iteration.It is priced between Rs 11.99 lakh and 15.49 lakh. (ex-showroom).\n\n  For two decades, the Mahindra Scorpio has been one of the most prominent SUVs in the Indian market. With its sturdy build, reliable performance and a signature bold look, the SUV has attracted customers all over the country.Due to its popularity, despite the arrival of the third-generation model, the Scorpio N, Mahindra has kept the second-generation model on sale. In August 2022, the carmaker renamed the existing SUV the Scorpio Classic and subsequently, it has received a stronger response from customers, as is evident from its sales figure.\n\n  With over 7,000 unit sales in August, the Mahindra Scorpio’s sales figure has nearly doubled after it took the Classic suffix. It is fair to say that the refreshed look and powertrain upgrades are favoring the SUV’s sales.The Scorpio Classic gets a new front end, refreshed rear profile and 17-inch alloy wheels with the ‘Twin Peaks’ logo all-around. The SUV also features LED DRLs, a nine-inch touchscreen infotainment display and a black and beige interior theme.",
//                 "image": "scorpioclassic.jpg"
//             },
//             {
//                 "title": "Ford Unveils Seventh-gen Mustang With More Power And A Modern Interior",
//                 "author": "Sonny",
//                 "category": "Sports",
//                 "article": "There is also an all-new performance version of the Mustang called the Dark Horse.\n\n  Ford has stated that the seventh-gen Mustang GT is powered by a new fourth-gen, 5-litre, naturally aspirated V8 Coyote engine. While there are no official power figures yet, Ford has stated a targeted output of over 480PS, making it the most powerful Mustang GT from the factory ever. It will continue to get the choice of a six-speed manual shifter or a 10-speed automatic. There will be performance versions of the Mustang GT that will extract even more power from the same V8.\n\n  The 2.3-litre turbocharged EcoBoost engine is said to be an all-new unit as well with more power and improved efficiency. It will also get the same transmission options.Ford has also worked on improving the driving dynamics of its latest muscle car with improved steering ratios and a range of customisable drive modes. There will also be the optional Performance Pack that includes wider tyres, bigger brakes, a Torsen limited-slip differential and MagneRide active suspension.\n\n Perhaps the most exciting mechanical update for the new Mustang GT is the new Electronic Drift Brake feature that makes it easier to drift with just the stock handbrake in the centre console. It was developed in close association with Ford’s partners in the competitive drifting motorsport.",
//                 "image": "mustang.jpg"
//             },
//             {
//                 "title": "Top Interesting Things About The Ferrari Purosangue SUV",
//                 "author": "Sonny",
//                 "category": "Luxury",
//                 "article": "Ferrari has finally premiered the highly anticipated Purosangue SUV. While various details including its controversial design and powertrain had been leaked online, the Italian marque had managed to keep a lot of its exciting details hidden until now. Here are the top 10 interesting facts and figures you need to know about the Ferrari Purosangue\n\n  Still looks like a Ferrari: While Ferrari may refuse to call the Purosangue an SUV, it sure looks the part. It might still be a bit polarising with its tall stance and flared arches, but the details are unmistakably Ferrari. The flowing bonnet has similarities with the Portofino while the headlights and taillights seem to be inspired by the SF90 Stradale. In profile, we can see a bit of Ferrari’s former practical offering, the GTC4 Lusso but with higher ground clearance and cladding around the wheels.Around the back, the Purosangue is a sculpture featuring various nips and tucks and creases that make it look Italian and sporty. There are ducts under the tail lamps, an integrated roof spoiler with a gap to guide airflow down the rear windscreen, a high-rising rear diffuser and a daunting dual-exit quad exhaust setup. Additionally, there are various aerodynamic elements all around the car to channel the air as and where it is needed.\n\n  Rolls-Royce style rear doors: The Ferrari Purosangue has suicide rear doors! These are proper, full-size doors too, not half slabs like the BMW i3 or Mazda RX8. Ferrari really wanted to make their newest model to offer a top-of-the-line luxury experience.\n\n  ",
//                 "image": "purosangue.jpg"
//             },
//             {
//                 "title": "BYD Has Delivered More Than 450 Units Of The e6 MPV In India Till Date",
//                 "author": "Ansh",
//                 "category": "Electric",
//                 "article": "BYD has delivered 450+ units of its premium e-MPV offering, the e6, across India since its launch in November 2021. At first, BYD launched the e6 only in Delhi, Mumbai, Bangalore, Hyderabad, Ahmedabad, Chennai, Kochi and Vijayawada. But the carmaker has now appointed dealers in Gurugram, Chandigarh, Jaipur, Pune, Indore and Kolkata as well to expand its network across the country. Recently, BYD has opened new dealerships in five cities: Delhi, Mumbai, Kochi, Vijayawada and Hyderabad.\n\n  The carmaker has provided the e6 with a vehicle warranty of three years/1,25,000km, battery cell warranty of eight years/5,00,000km and motor warranty of eight years/1,50,000km, whichever comes first in all three cases.\n\n  Now coming to the car itself, the e6 is powered by a 71.7kWh Blade battery (making 95.2PS and 180Nm). With this, it gets a WLTC-claimed range of 520km (city) and 415km (combined). The electric MPV is also capable of regenerating electricity from a minimum speed of 2kmph. It has two charging options: a 6.6kW AC charger and a fast 60kW DC charger with 0-100 percent charging times of 12 hours and 1.5 hours respectively.\n\n  Inside the e6 is a 10-inch rotatable touchscreen information display, a five-inch TFT dashboard, a four-way adjustable steering wheel, six-way manually adjustable driver and front passenger seats and halogen headlights with LED DRLs. It is also equipped with front and side airbags, rear three-point seatbelts, tyre pressure monitoring system (TPMS), ABS with EBD, electronic stability program (ESP), hill-start assist, rear parking sensors and a rearview camera",
//                 "image": "e6mpv.jpg"
//             },
//             {
//                 "title": "Mahindra XUV400 EV: Price Announcement, Test Drives, Bookings And Delivery Timelines Detailed",
//                 "author": "Tarun",
//                 "category": "Electric",
//                 "article": "Mahindra has revealed the XUV400 EV in India as its first mass-market electric SUV. The EV’s styling and most of the specifications have been revealed, but its asking price will be announced in January 2023, likely at the Auto Expo.\n\n  The test drives for the XUV400 EV will commence in December 2022, but only in 16 cities initially, likely to be Tier-I and II cities such as Mumbai, Delhi, Bengaluru, Chennai and Pune.\n\n  The official bookings will also commence from January 2023, perhaps shortly before the price announcement, while deliveries will begin by the end of the same month. However, Mahindra will give interested customers the opportunity to experience the electric SUV as part of the ‘XUV400 Fun Fest’ to be held from November.\n\n  The Mahindra XUV400 EV has a 39.4 kWh battery pack with a claimed range of up to 456 kilometres. The battery can be charged from nil to 80 per cent in 50 minutes with a 50kW DC fast charger. Its electric motor is rated at 150PS and 310Nm, more than its direct rival and can sprint from standstill to 100kmph in 8.3 seconds.The XUV400 features a sunroof, over 60 connected car features and dual zone AC. Its safety kit consists of six airbags, electronic stability control (ESC), cornering brake control, ISOFIX child seat anchorages and multiple active safety features as well.",
//                 "image": "xuv400.jpg"
//             },
//             {
//                 "title": "Hyundai Venue N Line Will Not Get iMT Or Manual Transmission",
//                 "author": "Rohit",
//                 "category": "Compact Suv",
//                 "article": "Hyundai has launched the Venue N Line in India in two trims: base-spec N6 and top-spec N8. While we were expecting it to get both the iMT (clutchless manual) and DCT (dual-clutch automatic) gearbox options as the i20 N Line, Hyundai has chosen to not offer the former. The carmaker has confirmed that it won’t be providing the Venue N Line with iMT or even a manual gearbox.\n\n  The carmaker says it has taken this call based on the response seen for the i20 N Line’s DCT trims. Both the hatchback and SUV share the same 1-litre turbo-petrol engine (120PS/172Nm) and a seven-speed DCT gearbox. The i20 N Line also gets a six-speed iMT. The N Line models get a stiffer suspension, a heavier steering wheel, and a sportier exhaust note.\n\n  The Venue N Line gets cosmetic tweaks inside and out which include the N Line-specific Thunder Blue shade, red accents all around and dual exhaust tips. Interior changes consist of an all-black cabin theme with red highlights and N Line badges. Its equipment list encompasses an eight-inch touchscreen, power-adjustable driver’s seat, and six airbags.\n\n  Hyundai has priced the Venue N Line between Rs 12.16 lakh and Rs 13.30 lakh (introductory, ex-showroom pan-India). It doesn’t have any direct rivals in India while the standard Venue takes on the likes of the Renault Kiger, Tata Nexon, and Maruti Brezza.",
//                 "image": "venue.jpg"
//             },
//             {
//                 "title": "2022 Range Rover First Look",
//                 "author": "Aditya Nadkarni",
//                 "category": "Luxury",
//                 "article": "The new Range Rover has been quick to make it to the Indian shores. The Tata Motors-owned brand pulled the covers off the updated flagship in October last year, while bookings and prices for India were announced barely three months later. How exactly does the new Range Rover take things a notch higher than the previous iteration? Let's find out.\n\n  The fifth generation Land Rover Range Rover receives a much-needed update and is now more loaded and luxurious than ever. The silhouette and the overall design remain broadly similar, and we agree with the brand's approach; why fix it if it isn’t broken, right? That said, the flagship SUV does get a fair bit of changes to the exterior design, where the design is pretty clean, smooth, and not very busy. Up-front, there's a set of LED headlamps that are now sleeker, and the highlight is in the details when you take a closer look. Talking about lighting, the fog lights are now horizontal units neatly blending in with the new air dam.\n\n Towards the side, there is an insert on the front doors that stands out in the otherwise clean design. The smooth finish is owed not just to the flush-fitting door handles but also the blacked-out pillars and roof, with the latter giving out a floating roof design. The model rides on 22-inch wheels, and for the first time, rear-wheel steering is being offered.The derriere gets black inserts on the tailgate, and at first glance, you're likely to mistake the vertically aligned LED tail lights for a part of the setup until they light up. Another clever design touch by the folks at JLR.",
//                 "image": "rangerover.jpg"
//             },
//             {
//                 "title": "New Maruti Brezza automatic First Drive Review",
//                 "author": "Sagar Bhanushali",
//                 "category": "Compact Suv",
//                 "article": "The engine powering the new Maruti Brezza is basically the same 1.5-litre, four-cylinder engine from before but with two injectors per cylinder, dual variable valve timing and a higher compression ratio. All of these changes have been made so that this engine can breathe better and be more efficient at normal operating RPMs. Now we cannot vouch for the improved efficiency today given the limited time that we have with the car but I can say for sure that this engine and gearbox combination is one of the smoothest in its class. This six speed torque converter gearbox especially is all about smooth progression.\n\n  The Brezza automatic feels at home in the city, in stop and go traffic. The progress in acceleration is smooth and so are the gearshifts from this new 6-speed torque converter automatic. Now, having driven the new crop of three cylinder turbo engines back to back, this four cylinder naturally aspirated engine feels very pleasant and when paired to the 6-speed automatic, the refinement that you get is the real highlight of this drivetrain.\n\n  In terms of outright performance, the new K15C engine makes 102bhp but because it’s naturally aspirated it doesn’t make as much torque as the turbo engines that you get in cars like the Hyundai Venue or even the Nissan Magnite. At 136Nm, the torque is just about adequate for everyday driving but what’s worth noting is that Maruti has tuned this engine to be more efficient than before and that has taken a toll on its drivability especially in the mid-range. What also doesn’t help when it comes to performance is the fact that the new Brezza weighs 40 kilos more than the old car because of all the new features. So, all in all, the pulling power is just about adequate and we do feel that the new Brezza isn’t as peppy as it used to be.   ",
//                 "image": "brezza.jpg"
//             },
//             {
//                 "title": "2022 Jeep Meridian — First Look",
//                 "author": "Ninad Ambre",
//                 "category": "Suv",
//                 "article": "Jeep recently unveiled the Meridian for the Indian market. This three-row SUV will be launched soon with deliveries starting by June this year. Here's all you need to know about the car.\n\n  First up, its looks. Some are of the opinion that it looks like the Compass and some say it borrows styling traits from the larger Grand Cherokee. In person, the Meridian looks big and is quite lengthy. The Jeep Meridian is based on the brand's unibody architecture. Yes, it does look like an extended version of the Compass with a long wheelbase. But there are more changes under the skin and the SUV is larger than its five-seater sibling. Also, the finer changes make it look different. Yet it's unmistakably a Jeep with its seven-slat grille up front flanked by sleek LED headlights with LED daytime running lights. On the side, the 18-inch alloy wheels get a more intricate detailing, thus lending it a striking pattern. Round at the back, it features slim wraparound LED tail lamps with a chrome strip in the centre. It's more slab-sided and upright, yet quite premium.\n\n  In terms of layout and design, the interior of the Meridian is similar to its sibling, the Compass. This is a good thing for it packs in all the positive traits. Taking centre stage is a 10.1-inch touchscreen infotainment system with Apple Carplay and Android Auto connectivity. Then, there's a 10.25-inch digital instrument cluster behind the leather-wrapped steering wheel. This is a highly customisable display as we'd seen earlier with its introduction in the Compass facelift.\n\n  Let's shift our focus to the third row of seating that differentiates it from the Compass. Here you can see a one-touch tumble down middle seat function that allows access to the last row, which, by the way, also gets reclining backrests. There's limited legroom and headroom though enough shoulder room for two. Then, there are dedicated air-con vents for the third row adding to the comfort of occupants. The middle row with a 60-40 split does add to the versatility but doesn't get a sliding function. However, all these seats can be folded flat for a more than sufficiently large and flat cargo bed. Owners will be glad to know that they will also get some boot space with all the seats up.",
//                 "image": "jeep-meridian.jpg"
//             },
//             {
//                 "title": "Mini Cooper S Convertible First Drive Review",
//                 "author": "Bilaal Ahmad Firfiray",
//                 "category": "Convertable",
//                 "article": "What the 189bhp of power on the spec sheet doesn’t tell you is the amount of driving fun the Mini Cooper Convertible delivers. There’s just enough firepower to keep a smile plastered on your face all day when driven with a skilful right foot. Even though the 2.0-litre turbocharged four-cylinder does take its time to spool up before its dramatic slingshot, the throaty burble accompanied by the downshift is music to our ears – especially with the top down.\n\n  It cranks up with a guttural exhaust note and settles down into a fantastic sounding idle. We know that the BMW-sourced four-cylinder has a good torque supply at slow speeds. With 280Nm accessible from as low as 1,250rpm, you can potter around at city speeds knowing that there’s a surge of twisting force waiting to be unleashed with one downward motion of the throttle pedal. This makes the Mini eager to drive around the city with an aberrant capability of closing into tight gaps in traffic at a moment’s notice.\n\n  Complementing this eagerness of the motor is the seven-speed dual-clutch transmission sending power to the front wheels. It upshifts quickly to keep the motor running smoothly and effortlessly. At highway speeds – with no urgency – maintaining triple-digit speeds is easy as the motor churns away under the 2,000rpm mark. But give it some beans and triple-digit speeds arrive quickly.  When timed on our V-Box, the 0-100kmph sprint in 7.34 seconds (in wet) might not seem like it – but the drama that ensues is what makes you put your money down on the Mini than any other premium hatch (or small crossover for that matter). As mentioned earlier, the kick-down is quick and dramatic and when accelerating from 40-100kmph, the Mini took 4.91 seconds which is impressive by any standards. Moreover, a 20-80kmph run was done in 3.93 seconds on wet – over half a second quicker than the BMW 220i which shares the same engine and underpinnings (but is heavier).",
//                 "image": "cooper-s.jpg"
//             },
//             {
//                 "title": "Lamborghini Huracan EVO First Drive",
//                 "author": "Vikrant Singh",
//                 "category": "Sports",
//                 "article": "This is the more powerful, more expensive, and more desirable version of what is one of the most successful V10-engined supercars ever, the Lamborghini Huracan. In this Evo guise, it makes almost 640bhp and 600Nm of peak torque, and this is from a naturally aspirated engine.\n\n  There are other changes too, as part of the Evo upgrade. It gets torque vectoring, all wheel steering, and LDVI. LDVI or Lamborghini Dinamica Velcolo Integrata is a system that uses an ECU to control the car’s overall dynamic behavior. But, Lamborghini adds that instead of reacting to a situation, this system anticipates what might be needed and responds accordingly, making it quicker and more intuitive.\n\n  There are other abbreviations that help this endeavour as well. There’s LPI (Lamborghini Piattaforma Inerziale) which uses accelerators and gyroscopic sensors to detect the Huracan’s acceleration in the three planes, as well as its roll, pitch and yaw. This info, then helps improve the response of the adaptive dampers, the car’s stability program, and its torque vectoring, all in a bid to give the supercar the best possible traction. And yes, there’s LDS (Lamborghini Dynamic Steering) or Lamborghini speak for a variable ratio rack, which is now coupled with four-wheel steer.\n\n  Naturally, a special Huracan deserves some visual add-ons as well. So, there’s a new, sportier bumper upfront, and the side intakes have been redesigned as well. But, it’s from the rear that the Evo truly stands out. The rear bumper is new, of course. But, the car also has its exhausts placed higher. And, the rear diffuser is now so aggressive, you’d submit to it without so much as a whimper.And though the rest of the things are more or less the same as a regular Huracan, it is still a sight to behold. Especially, in the flesh. With its low and wide stance, its wheels as big as flying saucers, and a silhouette that still deserves to be on every boy’s bedroom wall, the Huracan is as quintessential as a Lamborghini gets.",
//                 "image": "huracan-evo.jpg"
//             },
//             {
//                 "title": "Range Rover Evoque First Drive Review",
//                 "author": "Santosh Nair",
//                 "category": "Luxury",
//                 "article": "The Range Rover Evoque is available off-the-shelf with either a 245bhp/365Nm 2.0-litre petrol or a 177bhp/430Nm 2.0-litre diesel, both of which are mated to a nine-speed automatic gearbox. First off, I have to admit that the diesel we’re reviewing here is so refined you’ll be hard-pressed to know it’s one, unless you’re revving hard into the limits. In fact, the acute lack of buzz will amusingly lead to speeding unless you constantly peep at the speedo! To that end, the power delivery is decidedly linear, which when combined with the nine smooth-shifting well spaced-out cogs, ensures that the motor’s output is optimally utilised. What does this mean for us?\n\n  Well, in short, you won’t be left wanting for more to get off the mark or make a quick overtake on the highway; even under full throttle. Making these drivability characters even more accessible on the go are the drive modes – Eco, Comfort, and Sport. When slotted in Eco, this diesel leisurely builds up pace in the obvious interests of fuel efficiency. Comfort mode, on the other hand, offers distinctly speedier responses for swift commutes and Sport mode is more like the steroids genre wherein upshifts are brisk and responses are crisp to the bone. Not downshifts though. You may want to drop gears via the paddle shifters yourself while overtaking at higher speeds since the system isn’t likely to respond as expected, even in Sport mode.\n\n  The ride in this Range Rover is firm at slow speeds, a façade that gives it a bumpy ride over larger irregularities and broken surfaces. Although the ride quality gets flatter as the Evoque hits highway speeds, we ironically noticed that road, suspension, and tyre noise can be a bother. Also, this SUV tends to nose-dive under harsh braking, but in the end, these attributes are barely deal breakers as such. Conversely, the steering, with two and one-quarter turns from lock-to-lock is certainly quick by SUV standards, is vastly progressive and because there’s enormous feedback, one can get out of tricky situations by just modulating the input on the go like a pro. Plus, there’s ample grip and despite the fair levels of body roll, it inspires enough confidence to hold its own around tighter bends.",
//                 "image": "evoque.jpg"
//             },
//             {
//                 "title": "New Toyota Innova Crysta Petrol Limited Edition coming soon; features revealed",
//                 "author": "Aditya Nadkarni",
//                 "category": "Muv",
//                 "article": "Last month, Toyota Kirloskar Motor (TKM) had temporarily stopped accepting bookings of the petrol-powered Innova Crysta in the country. Earlier this week, the carmaker officially confirmed the development, citing overwhelming demand for the oil-burner variants of the MPV.\n\n  Now, Toyota is set to introduce a limited edition version of the petrol-powered Innova Crysta. Ahead of its price announcement that is expected to take place soon, the Bidadi-based automobile brand has revealed the features of the 2022 Innova Crysta Limited Edition.\n\n  Over and above the features on the standard version, the Toyota Innova Crysta Limited Edition will come equipped with features such as a wireless charger, a Tyre Pressure Monitoring System (TPMS), and a Heads-Up Display (HUD).Under the hood, the Toyota Innova Crysta Limited Edition will be powered by a 2.7-litre, four-cylinder petrol engine that produces 164bhp and 245Nm of torque. This engine could be paired with a five-speed manual unit and a six-speed torque converter automatic unit. More details are expected to surface soon. Stay tuned for updates.",
//                 "image": "innova-crysta.jpg"
//             },
//             {
//                 "title": "BMW X4 50 Jahre M Edition launched; prices start at Rs 72.90 lakh",
//                 "author": "Aditya Nadkarni",
//                 "category": "Luxury",
//                 "article": "BMW India has launched the X4 50 Jahre M Edition in the country, with prices starting at Rs 72.90 lakh (ex-showroom). The model is available in two variants, including X4 30i M Sport and X4 30d M Sport, priced at Rs 72.90 lakh and Rs 74.90 lakh (ex-showroom).\n\n  Exterior highlights of the BMW X4 50 Jahre Edition include the signature kidney grille with all-black mesh inserts, adaptive LED headlamps, an M Aerodynamic package, M high-gloss shadow line accents, wraparound LED tail lights, and blacked-out tailpipes. Also on offer are 20-inch Jet Black alloy wheels and red M Sport brake calipers.\n\n  The interiors of the BMW X4 50 Jahre M Edition comes equipped with Vernasca leather upholstery with black décor stitching, a panoramic sunroof, ambient lighting, welcome light carpet, and three-zone climate control.\n\n  Under the hood, the BMW X4 50 Jahre M edition is offered with a 3.0-litre, four-cylinder petrol engine producing 248bhp and 350Nm of torque, as well as a 3.0-litre, four-cylinder diesel engine producing 261bhp and 620Nm of torque. An eight-speed transmission is the sole gearbox on offer.",
//                 "image": "bmw-x4.jpg"
//             },
//             {
//                 "title": "Maruti Suzuki recalls Dzire Tour S",
//                 "author": "Gajanan Kashikar",
//                 "category": "Sedan",
//                 "article": "Maruti Suzuki has recalled 166 units of the Dzire Tour S due to a possible defect in the airbag control unit (ACU). These affected units were manufactured between 6 August to 16 August, 2022, and are recalled for replacement of the ACU free of charge.\n\n  Maruti suspects the probable defected airbag control unit might malfunction during the deployment of airbags. It has urged the owners of the affected Dzire Tour S to not drive it until the workshop replaces ACU. Further, Maruti Suzuki-authorised workshops will send a communication to its customers for the replacement of the faulty airbag control unit.\n\n  Meanwhile, the Dzire Tour S owners can visit the Maruti Suzuki website and fill in the 14-digit alphanumeric chassis number in the ‘Imp Customer Info’ section to check whether their vehicle requires the replacement of the airbag control unit.",
//                 "image": "dzire-tour.jpg"
//             },
//             {
//                 "title": "Mercedes-Benz C-Class Cabriolet Summary",
//                 "author": "James Carter",
//                 "category": "Convertable",
//                 "article": "Mercedes-Benz India introduced the C-Class Cabriolet in India shortly after introducing the updated C-Class sedan in India. The drop-top C-Cabriolet comes with a new BS-VI petrol engine, special AIRCAP system, LED headlamps, two metallic body colours. The C-Cabrio is available in a single C300 trim priced at Rs 65.25 lakh (ex-showroom Delhi).\n\n  Based on the same car as the recently updated C-Class, the changes are around the headlamps and grille along with a revised tail. Just like the C-Class Coupe, the tail lights of the Cabriolet are sleeker than the one seen on the sedan. The grille can now also be had as the diamond radiator grille with chrome pins instead of the standard dual-louvred one. The bumpers get an AMG-like design with larger intakes and a sporty bumper lip. The Cabriolet also comes with MULTIBEAM LED headlamps with pixel-specific beam range and coverage control. This headlamps unit is usually seen in expensive Mercedes-Benz models. It sits on stylish 17-inch, five-large spoke lightweight-alloy wheels and is available with two new metallic paint finishes – Mojave Silver and Selenite Grey – apart from one special paint, Designo Selenite Grey Magno\n\n  The Cabriolet also comes with Mercedes’ special equipment called the AIRCAP system which noticeably reduces the airflow in the interior when the top is folded down. The interior is dominated by a large 10.25-inch screen with the new generation telematics. There are features like steering mounted control, 64 ambient colour, smartphone integration with Android Auto and Apple CarPlay, and open-pore walnut wood trim inside the cabin.Powering it is an all-new M264 petrol engine which is compliant to the BS-VI standards. This 2.0-litre four-cylinder petrol engine produces 258bhp and 370Nm and is mated to a nine-speed automatic transmission sending power to the rear wheels. The cabriolet is capable of going from zero to a 100kmph in just 6.2seconds.At Rs 65.25 lakh ex-showroom, the C-Cabriolet is pricier by almost Rs 7 lakh than the top-spec C 300d AMG Line sedan. The C-Class Cabrio is a niche product in the country and only rivalled by the Audi A5 Cabriolet in its segment. However, the C-Class Cabriolet comes with the Three-Pointed Star placed at its nose and this demands an unparalleled respect in our country.",
//                 "image": "cclass-cabriolet.jpg"
//             },
//             {
//                 "title": "Ferrari Portofino M: exterior, interior and engine",
//                 "author": "Shreyash",
//                 "category": "Convertable",
//                 "article": "M stands for Modificato, which translates rather un-sexily to ‘modified’. So, technically, this is a mid-life update for the Portofino, something Ferrari doesn’t do with its other model lines anymore. Don’t, whatever you do, call it a facelift, however, because that would not do justice to the amount of engineering that’s gone into it. Yes, there have been some visual updates too, but as you might expect, most of them are functional. There are bigger, angrier air intakes in the front bumper, new vents in the bonnet, and at the rear, a larger, more aggressive diffuser. That last bit was a function of performance too, because to meet new emissions regulations, the Portofino had to be fit with Gasoline Particulate Filters (GPFs) which tend to dull the noise the car makes. To counter this, Ferrari reprofiled the exhaust and simply deleted the silencers, so now it’s louder than ever! And this also freed up space at the rear for that bigger diffuser. To these eyes, it’s still not the prettiest Ferrari, but it certainly looks more purposeful now.\n\n  The meat of the mods is in the powertrain, however. The 3.9-litre twin-turbo V8, like in the Roma, puts out 20hp more, at 620hp and 760Nm, and this was achieved thanks to new cam profiles, and a new speed sensor for the turbochargers. The 7-speed dual-clutch auto has been ditched for an 8-speed unit, again from the Roma, and while the eighth ratio is taller to boost highway efficiency, it’s allowed Ferrari to shorten gears one through seven and stack them tighter for more aggressive acceleration. The biggest clue to the M’s new-found sporty intent is the Mannetino switch on the steering wheel, which now has five modes, including Race – previously deemed too serious for the cushy Portofino.\n\n  The inside hasn’t changed much – for better or for worse, depending on whom you ask. Ferraris have been evolving so fast that even this four-year-old interior is starting to look dated by the brand’s own standards. Personally, I prefer it to the newer stuff. I love that the tachometer is not a screen but a proud analogue dial in the centre, and that the steering wheel has real, solid buttons and switches, rather than haptic ones. I love that the AC vents are the beautiful, round, jet-turbine funnels that can be focussed directly on your face, and that clear, simple buttons operate the gearbox, not a gimmicky faux gated ‘shifter’.",
//                 "image": "ferrari-portofino.jpg"
//             },
//             {
//                 "title": "Mercedes-Benz AMG GT Review",
//                 "author": "Rohit",
//                 "category": "Sports",
//                 "article": "This is the most focused Mercedes-Benz I have ever driven. Right from its racy exterior, to the first time you crank up the handmade turbocharged engine, it is clear that the AMG GT S is built for a singular purpose, to propel you towards the horizon before the blink of an eyelid.\n\n  Replacement to the mighty SLS, the GT is not only inspired by styling from its larger predecessor it also has the same front-engine-rear-gearbox layout. Where the SLS had a more in your face exterior, its successor carries a more rounded appearance and it looks much more compact and agile. When viewed in profile the long bonnet, old race car-like glasshouse and the rounded boot section with a large overhang looks very familiar. Like the SLS, you can’t make dramatic entrances at parties though as the Gull-wing doors are replaced by conventional ones. This has also helped the AMG division keep the centre of gravity down.\n\n  This Mercedes’ ace, though, is its 4.0-litre V8. The Mercedes GT S uses the same 503bhp motor as the C63 sedan but it gets dry sump lubrication to take higher lateral loads and the motor is also placed lower down in the engine bay. Mercedes has pushed the engine all the way back behind the front axle for minimal unsprung weight and has managed to distribute weight almost evenly over the four wheels.\n\n  The Truck has a Mahindra M2DICR 4 cylinder inline 2523 CC 2.5L DI turbocharged diesel BS6 engine which generates a power of 75HP @ 3200 RPM and torque of 200 Nm @ 1400-2200 RPM. It has a 5 speed manual fully synchromesh type gearbox with a single plate dry friction type clutch.If we look at the suspension it has rigid leaf spring with hydraulic double acting telescopic shock absorbers in front with 5 no. of leaves and rigid leaf springs with hydraulic double acting telescopic shock absorber suspension in rear with 9 leaves.",
//                 "image": "amg-gt.jpg"
//             },
//             {
//                 "title": "Mahindra Bolero Pickup 1.7 BS6 launched – Detailed overview",
//                 "author": "Tarun",
//                 "category": "Pickup",
//                 "article": "Mahindra has launched its all-new BS6 compliant 1.7-ton extra-long Mahindra Bolero Pickup truck. Everyone knows that this vehicle is also known as the king of pickup vehicles. Only Tata Yodha is its direct competition. As per recent stats, Mahindra sells 1 pickup truck every 1 min which leads to 1.44 lakhs units sold to date. Mahindra holds a 64% market share in the pickup truck segment.\n\n  Ground clearance of the vehicle is quite high which is 195 mm due to this a footboard is given by the company. This vehicle comes in two payload options – 1700 Kg and 1245 Kg and now this vehicle is also available in BS6 compliant option. Mahindra has provided a strong chassis now to carry its 9 feet extra long loading bay.\n\n  The company has made interiors very similar to an SUV. Seats are quite comfortable with sliding and recline adjustable driver seat. The dashboard looks very stylish as shown in the image with power steering, mobile charging options with the dual-tone interiors. The truck has floor mats, a lockable glovebox, ELR seat belts, and many other storage places but there is no power window option.",
//                 "image": "bolero-pickup.png"
//             },
//             {
//                 "title": "Land Rover Defender India review, test drive",
//                 "author": "Sanket",
//                 "category": "Offroad",
//                 "article": "Memories of driving the new Defender in the vast, desolate expanses of Namibia are still vivid. It was my last international drive – before COVID-19 turned the world upside down – and arguably my best in over 30 years of driving all over the world.Testing the hugely capable new Defender to the max in some of the most gruelling but hauntingly beautiful and secluded terrains in the world was a once-in-a-lifetime adventure.It had a sense of freedom that I cherished even more sitting at home during the dark days of the lockdown, wondering when we could go back to driving in some remote pocket of the world.\n\n  Eight months on, I’m once again reacquainted with the Defender, not in some exotic or far-flung locale like before, but right here in the heart of Mumbai. Now Mumbai is home to me, but is it home to the Defender? Those three days in Namibia have convinced me that there is no better off-roader in the world. But how good is it on road? To be honest, I don’t really know because only 40 of the 700 kilometres we drove in Namibia were on tarmac; the rest was on surfaces that would make ordinary 4x4s wince.\n\n Mumbai is diametrically the opposite of Namibia. It’s as densely populated as Namibia is uninhabited, and the roads are as clogged as Namibia’s are devoid of any traffic. There are no rivers, deep ravines, no limitless deserts, nor the dreaded Van Zyl’s Pass to wrestle with, but the environment in and around Mumbai has its own challenges and can be equally daunting. How well can the five-metre-long Defender cope with the broken tarmac and huge potholes of a post-monsoon road network? How well can it thread through the gullies that criss-cross the underbelly of the city and, equally, how well can it play the role of a luxury SUV? Will the built-for-the-wild Defender feel like Crocodile Dundee when he turned up in New York? Or can it seamlessly slip into Mumbai’s urban chaos? These are questions the Defender, which has finally been launched in India, now has to answer.",
//                 "image": "defender.jpg"
//             },
//             {
//                 "title": "Rolls-Royce Dawn Overview",
//                 "author": "Rohit",
//                 "category": "Convertable",
//                 "article": "While the Wraith coupe dazzles with its fastback roofline, the 2021 Rolls-Royce Dawn gives onlookers a better view of how the other half lives. With its cloth top down, the Dawn lets the sun shine in on the one of the most luxurious interiors in the car business—one that's custom handcrafted from high-end leather, real metal, and genuine wood trim to the buyer's exact specifications. With the six-layer top in place, it's nearly as quiet and comfortable as the Ghost sedan. A 563-hp V-12 engine provides quick acceleration, but the Dawn is happiest when it's quietly cruising, as its suspension is tuned exclusively for comfort.\n\n  Under the hood sits a twin-turbocharged 6.6-liter V-12. It pumps out 563 horsepower, making the Dawn as fleet as it is sexy. At the test track, the Dawn rushed to 60 mph in just 4.3 seconds. It moves gracefully and deliberately, and it cossets passengers even when driving over the harshest potholes. The eight-speed automatic transmission is tuned for tranquility. It uses GPS to determine when it should change gears, considering whether the car is going uphill, downhill, or around corners. That said, if you want a sharper, more athletic grand-touring convertible, perhaps look at the Bentley Continental GT, which is both faster than the Dawn and sportier to drive\n\n  Like the rest of the Rolls-Royce lineup, the Dawn isn't particularly fuel efficient. Its EPA fuel economy ratings of 12 mpg city, 18 mpg highway, and 14 mpg combined match those of the Ghost sedan, and its highway rating is slightly lower than the flagship Phantom's. We'd love to put the Dawn through our fuel-economy test—who wouldn't want to spend 200 miles cruising on the highway in this luxury boat?—and if we ever get the chance, we'll update this story with our results.\n\n  Rear-hinged doors provide easy access to the Dawn's cabin, which seats four adult passengers. Occupants will be dazzled by the gorgeous butter-soft leather and acres of real wood trim. Buyers can opt for a massaging function for the front seats and thick lambswool floor mats that pamper the tootsies of anyone lucky enough to come along for the ride. As for storage space, the Dawn's trunk is on the small side for a large car—blame the convertible top for that—but it should provide enough space for a pair of carry-on suitcases.",
//                 "image": "dawn.jpg"
//             },
//             {
//                 "title": "BMW-Z4 Overview",
//                 "author": "Rohit",
//                 "category": "Convertable",
//                 "article": "The Z4 has changed. It's become sportier – the old one, with its folding hardtop and cuddly dynamics, took aim mostly at the Mercedes SLK (now SLC). The new one has a fabric top, dropping the weight measurement and centre of gravity. It's evidently having a pop at the Porsche 718, itself in a vulnerable position since the much-lamented departure of that old flat six.To prove its sporting bent, we're driving a Z4 with an M in its name. Well, a part-way M car, the Z4 M40i. It's got a turbo six with 340bhp. Other engines are four-cylinders in the 30i and 20i.\n\n Ah yes, sporty. Hello internet, the ’Ring time is comfortably under eight minutes. The Z4's physical dimensions are good for hot laps. The wheelbase is shorter than before by a huge 20cm, for agility. The track is much wider, for grip. The body is a whole lot stiffer than the old Z4's, and it's light.\n\n  The front suspension, unlike other BMWs, mounts to a special aluminium subframe for precision. Those aren't the only declarations of intent. The Z4 M40i's tyres come from the M4. Its brakes are M-developed too. There's an e-diff between the rear half-shafts. You get the gist.You can thank Toyota for the existence of the Z4. Toyota wanted a new Supra but didn't have a platform. BMW saw the roadster market softening and wasn't sure if it could sell enough to justify replacing the Z4. But sharing could satisfy the spreadsheet-jockeys. BMW of course is one of the staunchest global holdouts for straight-six engines and rear drive, two articles of faith for a Supra.So the Supra gets most of the Z4's basic engineering, which is BMW stuff. Engine, suspension and basic platform parts, and electronics too, come from BMW's current set that's used on every longitudinal car they've launched since the 7-er of 2017. The Supra is tuned and set-up differently from the Z4. Both the cars are built at a BMW-overseen line in the Magna plant in Austria.",
//                 "image": "bmw-z4.jpg"
//             },
//             {
//                 "title": "Porsche 911 Carrera S review, test drive",
//                 "author": "Shreyash",
//                 "category": "Sports",
//                 "article": "Let’s get the cynicism out of the way right at the start – this is a new-generation Porsche 911. It’s called the 992 and it’s the eighth iteration of the iconic sportscar. Yes, Porsche tends to make two generations back to back, so there are some commonalities with the outgoing 991, but there are also some changes. The body panels are now almost entirely aluminium, it’s managed to put on about 50kg in kerb weight despite all that aluminium, it has grown by 21mm, 44mm and 7mm in length, width and height respectively, the tracks are wider and the wheels are larger. Initially, at least, I have to admit I too am amongst the cynics. I can’t shake the feeling that this just doesn’t feel like a full generational leap forward.\n\n  The driving position is just so right; it’s set low, as it should be, but even someone as short as me can find a good compromise, because forward visibility is really good. You get the typical 911 view forward, of the two headlamp bulges rising out of the bonnet, helping you place the car perfectly.\n\n  I grip the small-rimmed steering wheel, twirl the mode selector to Sport, and then it hits me. I glance back down to that minimalist centre console and realise all the driving mode controls are gone. There’s a suspension toggle switch and an ESC off button, but that’s it. If you want to switch drive modes, activate the sport exhaust or even raise the spoiler for a bit of showing off – that’s right, it’s all on the touchscreen now. Even the aforementioned mode selector dial is a part of the optional Sport Chrono Package, which you  should probably select just for the convenience.\n\n",
//                 "image": "porche-911.jpg"
//             },
//             {
//                 "title": "Isuzu D-Max V-Cross Quick Review",
//                 "author": "Autocar",
//                 "category": "Pickup",
//                 "article": "The Isuzu D-Max V-Cross is a large vehicle and much of its length comes from the big loading bed. The loading bed is long, wide and well-shaped; and can hold cargo of all shapes and sizes. What adds to the V-Cross’ practicality is the fact that the cabin is also quite roomy, although the upright rear backrest is a spoiler. In quality and execution, the V-Cross’s cabin is closer to a like-priced SUV than a utilitarian pick-up.The Isuzu D-Max V-Cross is powered by a 136hp, 2.5-litre turbo-diesel engine that feels flexible and friendly in the way it delivers its power. The engine is quite refined too and the easy-to-use 5-speed manual gearbox is nice as well. Buyers who want the convenience of an automatic transmission will have to opt for the new 1.9-litre diesel engine version. Despite a stronger 150hp on call, the 1.9-litre engine is very similar in character to the larger 2.5-litre unit. As for the the automatic gearbox, it is smooth and does the job. Shift-on-the-fly four-wheel drive adds all-weather and all-condition ability to the V-Cross’ repertoire.Ride quality is fine but there’s a marked difference in how the D-Max V-Cross behaves with and without cargo – the rear-end feels bouncy when not loaded. Unfortunately, the heavy and slow steering makes the V-Cross ponderous to drive in town.",
//                 "image": "isuzu.jpg"
//             },
//             {
//                 "title": "McLaren 720S review",
//                 "author": "Eric Stafford",
//                 "category": "Sports",
//                 "article": "Like many exotic cars, the 2022 McLaren 720S offers a lot of show and serious go. The thrills include explosive launches and the kind of ethereal agility that'll send serious drivers into ecstasy. At the heart of McLaren's lightweight, carbon-fiber-intensive dream machine is a 710-hp twin-turbo V-8. While the engine has considerable turbo lag, the short pause after you stomp the accelerator allows a beat to prepare for a rush to 100 mph in just 5.2 seconds and the ability to reach a claimed 212 mph. When 720S coupe or Spider (read: convertible) drivers aren't living out their Formula 1 fantasies, they’ll find the car provides a surprisingly civil ride. The only real pain is the contortions required to climb out of its simple yet customizable interior. Yes, the 2022 720S is insanely pricey, but that money buys a car that's insanely special.\n\n  Both the coupe and convertible version cradle a twin-turbocharged 4.0-liter V-8 that produces 710 horsepower and 568 pound-feet of torque. Those totals are funneled through a paddle-shifted seven-speed dual-clutch automatic transmission. The 720S coupe we tested at our track rocketed to 60 mph in 2.6 seconds and reached 100 mph in 5.2 ticks. We also had the opportunity to pilot a similar version at our annual Lightning Lap, where we called it wonderfully fun and scary fast. We drove one on a twisting and ill-maintained road in California, where its advanced suspension was able to smooth out imperfections and the steering system was a communicative companion. The experience was further evidence that McLaren has unrivaled chassis tuning.\n\n  Since the McLaren 720S clearly isn't a typical commuter car, it doesn't receive the typical EPA certification. We estimate the mid-engine machine would achieve between 15 mpg in the city, 22 mpg on the highway, and 18 mpg combined. However, we expect its real-world fuel economy to vary drastically depending on how much time it spends with its throttle wide open.",
//                 "image": "mclaren-720s.jpg"
//             },
//             {
//                 "title": "New Bentley Mulliner Batur breaks cover",
//                 "author": "Gajanan Kashikar",
//                 "category": "Sports",
//                 "article": "British ultra-luxury automaker Bentley has unveiled the coach-built Mulliner Batur coupé at the 2022 Monterey Car Week. This über-exclusive automobile is just limited to 18 units with each at a sticker price of £1.65 million (approximately Rs 15.60 crore), minus any taxes or personalisation options. Furthermore, the marque has already sold all 18 units of the Batur.\n\n  Bentley has not only revealed the coach built by Mulliner in the form of the Batur but also showcased the design direction of the brand for its future electric cars. This coupé brings a revolutionary design language while still bearing the classic Bentley touch. In fact, the Mulliner Batur is based on the newest long-wheelbase Continental GT.\n\n  Although the grand tourer previews the novel design philosophy of the carmaker, it is not an electric car. But the Batur will be the most powerful car Bentley has ever created. It will get a more powerful version of the iconic 6.0-litre, W12, bi-turbocharged petrol mill, which is still under development. However, Bentley says that this heavily tuned-up engine will be able to generate a staggering 730bhp and 1,000Nm of torque.\n\n  With this, the firm has hinted at the end of the era of its long-lived W12 engine. But not before a proper send-off. In a statement, the brand states, 'as the engine enters its twilight years as part of Bentley’s Beyond100 transformation journey to being fully electrified, the Batur forms the first part of a celebration of the W12’s extraordinary power, torque and refinement'. With this, Bentley appears to indicate that it will not end the production of the most powerful version of the W12 and might add it to more cars, be it new or existing models.",
//                 "image": "bently.jpg"
//             },
//             {
//                 "title": "Datsun GO Plus Performance",
//                 "author": "Sonny",
//                 "category": "Muv",
//                 "article": "The Datsun GO+ continues to be powered by the same 1.2-litre, 3-cylinder petrol engine as before and there is no diesel motor on offer. This engine produces 68PS and 104Nm of torque. With the CVT transmission, the power is bumped up to 77PS.\n\n  While the output figures haven’t been altered with the update, Datsun’s engineers have made revisions to the gear ratios of the 5-speed manual box in order to improve driveability. As a result, the car still feels peppy, with the engine pulling strongly from 2000rpm onwards. Of course, this isn’t a car meant for pleasing the enthusiasts, but with a claimed 0-100kmph time of 13.3 seconds, the GO+ is supposedly as quick as the Ignis petrol AMT. We’ll put the car through a road test to verify these figures.\n\n  However, it does look like the added weight has had an impact on the driveability of the GO+, even with the altered gearbox ratios. It’ll still pick up from 30kmph in fourth gear without the engine knocking, but there is a l-o-n-g wait before the speedometer starts to climb again. This becomes apparent when the car is running on a full load, forcing you to provide a heavy throttle input to get going. As expected, the powertrain’s tuning is primarily for city commuting.\n\n  On the highway, it’ll click 100kmph but does run out of breath if you try to make it go much faster. High speed overtakes also require some planning. Overall, though, the Go+ still retains its capabilities as a daily driver. At 19.83kmpl, the claimed fuel efficiency is now slightly lower than before but still very impressive standalone.The CVT transmission is well-tuned for the cars and makes commutes effortless. While overtaking, the ‘rubber-band’ effect is kept well under check and you get fairly clean acceleration. By default, the gearbox likes to hold low revs. Push it harder and you will feel a delay in power. If you suddenly go hard on the throttle, there is a slight jerk - almost like a kick-down.",
//                 "image": "datsun.jpg"
//             },
//             {
//                 "title": "Toyota Vellfire Interior Review",
//                 "author": "Rohit",
//                 "category": "Muv",
//                 "article": "The seats can make a 747’s business class couch feel envious and there is plenty of space and practicality to appeal to the left hemisphere of your brain as well. But can you justify spending Rs 85 lakh on a Toyota MPV which is just a size bigger than the Innova? Should you even bother?\n\n  Of course, and that too in the second row. Because that's where the Vellfire will justify its asking price. Like most large MPVs, the side doors are powered and slide back. And the sight they open is the one you get when you sneak a peek into the business class cabin on an international flight. In fact, Toyota says the car has been designed around the seats, and it definitely shows.You get two upholstery options - black and Flaxen (beige). The seats themselves are massive. Separated not just by armrests, but an entire seat structure. The moment you bum hits the base, you know this is going to be a comfortable affair. The cushioning is soft and you kind of sink into them, like on a sofa. The armrests are tall and also get a soft leather upholstery for added comfort. The entire seat is dressed in leather and reeks of aristocracy.\n\n  When it gets to seat adjustment, the Vellfire really takes the game ahead. Because flip open the outside armrest and you find a control panel. This lets you recline the backrest, adjust the angle of the footrest and even extend it - all electrically. Plus, you even get two memory settings so you can set one for an upright commute, and another one for lounge, and swap between them with just a touch. However, the horizontal sliding is manual. Understandable as the only way to get in the third row is by moving the second row seat forward, and that will take a long time if it was powered.You even get heated and cooled function for second row seats. This is a godsend for Indian summers and is not present even in the limousine class of sedans in the country. You get your own spotlight reading lamp, again controlled from the armrest control panel. The headrests are unique too, and are very comfortable. Their sides can be adjusted and made narrower, making it easier to sleep in. Controls for the rear climate control are placed just ahead of the sunroof and are easy to reach from the boss seat.\n\n ",
//                 "image": "toyota-vellfire.jpg"
//             },
//             {
//                 "title": "Mahindra XUV700 Verdict by Company",
//                 "author": "Mahindra Company",
//                 "category": "Suv",
//                 "article": "If you are in the market for a new car, stats suggest you are likely looking for an SUV. But narrowing it down from there is a little difficult as there are just too many options. There are sub-4 metre SUVs, compact SUVs, 5-seater, 7-seater, petrol, diesel, manual, automatic and all-wheel-drive SUVs. And when you finally decide which one you want, you just end up with more options from different brands. Mahindra plans to put an end to this confusion with the XUV700.\n\n  Mahindra has created waves across multiple segments by announcing the prices for the XUV700. The base MX5 5-seater variant starts from Rs 12 lakh for petrol and Rs 12.5 lakh for diesel. This will rival the sub-4 metre SUVs. The variant above, the AX3 petrol 5-seater, is priced at Rs 13 lakh and the AX5 5-seater petrol variant is priced at Rs 14 lakh. These will rival the compact SUVs like Seltos and Creta. Finally, the top AX 7 7-seater variants will rival the likes of the Safari and Alcazar. With such aggressive pricing, the XUV700 certainly looks to be the next big SUV in the market.\n\n  Spending a day with the XUV 700 has made us realise just how good a family SUV it is. It has an impressive road presence, the Cabin feels premium, space is impressive, the ride is comfortable, the feature list is long and impressive and finally both the petrol and diesel engine options along with their transmissions are very capable. Yes, it could have done certain things better like a few quality issues in the cabin and the missing features. However, as soon as you bring the price into the picture these misses start feeling even smaller.\n\n  If you are in the market looking for any kind of SUV for your family, the XUV700 first  gets all the basics right to then impress you with its segment-first features. It certainly deserves to be on your consideration list.",
//                 "image": "xuv700.jpg"
//             },
//             {
//                 "title": "Hyundai Creta Review",
//                 "author": "Gavin D'Souza",
//                 "category": "Compact Suv",
//                 "article": "It couldn’t have been easy to make the second-generation Hyundai Creta, especially considering the old one was at the top of its game, right until the end of its life. Love it or hate it, there’s no two ways about it, it was nothing short of a blockbuster.\n\n  A big contributor to the first Creta’s success were its strong, SUV-like proportions. It wasn’t very large or imposing, and in fact, before the facelift, you could even call the looks quite dull, but it had just the right shape and that worked. The new Creta, a visibly larger vehicle, also has superb proportions, with a chunky, square-shaped front end, thick creases over the wheel arches, broad shoulders and a roofline that has a nice silver accent on the C Pillar. However, the smaller details will likely polarise people. The 17-inch alloys (dual-tone and diamond-cut on some variants) are of an interesting but unexciting design. The flat nose of the car is home to a big grille and lighting is via an unusual, three-part C-shaped LED DRL pattern, with the actual LED headlamps in a cluster lower down (the indicators and fog lamps are lower still). The LED tail-lamps mirror the headlamps, with their C-shaped design and brake-light cluster, although a neat black strip housing the high-mount stop lamp adds some relief. The design is quirky at best and fussy at worst.\n\n  The interiors are quite the opposite, and you’re welcomed by a clean and simple dashboard design, with a rather elegant V-shaped flowing centre console. Exclusive to the 1.4 Turbo model is this all-black interior with red highlights, while the others get a more conventional beige and black. There’s even contrast stitching on the leather-wrapped steering wheel and the throttle-like gear selector – both of which bear an uncanny resemblance to what you’ll find in a modern Audi. Sporty as this colour scheme is, though, it highlights the Creta’s liberal use of hard shiny plastic, and places it right in your face. While the plastic quality itself is pretty good for the class, it lacks soft-touch materials like many rivals offer, and there’s very little brightwork anywhere, which takes away from the perceived quality.\n\n  ",
//                 "image": "hyundai-creta.jpg"
//             },
//             {
//                 "title": "Skoda Slavia 1.5 TSI First Drive Review",
//                 "author": "Shantonil Nag",
//                 "category": "Sedan",
//                 "article": "The 1.5 TSI engine from the VW Skoda Group is an advanced piece of engineering. It is the same engine that is available with the cylinder deactivation technology. The system works by deactivating two cylinders out of the total four to offer a much better fuel efficiency.The cylinder deactivation system is not noticeable when it works. The only way you get to know that the two cylinders have been deactivated is through the notification you get on the screen. It is a very well-tuned technology that only higher-end cars from Audi used to get a few years ago.The 1.5-litre TSI engine of the Skoda Slavia generates a maximum power of 150 PS and a peak torque of 250 Nm. It is available with a six-speed manual transmission and a 7-speed DSG automatic. We only drove the dual-clutch variant and will talk about that powertrain.\n\n  The Skoda Slaiva 1.5 TSI engine is the most powerful unit available in this segment. It is rev-friendly and goes to a 6,500 rpm redline, without a hiccup. The power delivery is extravagant and it hits the 100 km/h mark on the speedometer without any effort.With the 7-speed DSG, Skoda has tuned it very well with the engine. In fact, it feels much better tuned than the Skoda Kushaq and the gearshifts are silky smooth. DSG also gets paddle shifters that you can use to change the gears on the move. In fact, if you put the DSG in manual mode, it holds the revs to 6,500 rpm and won’t upshift automatically. It really gives control over the gearshifts, which the enthusiasts will love.The wide gear ratios of the DSG ensure that it masks any turbo-lag in the engine. We briefly drove the manual for a couple of kilometres. The six-speed transmission has tall gearing and if you drive in crowded, slow-moving traffic then the manual transmission requires a lot of shifts, especially at low speeds. But on the highway, the manual is a breeze to drive. The clutch is light and there is no need to shove it against the floor to shift the gears.",
//                 "image": "skoda-slavia.jpg"
//             },
//             {
//                 "title": "2022 Maruti Alto K10 first drive review: Fresh but familiar!",
//                 "author": "Shantonil Nag",
//                 "category": "Hatchback",
//                 "article": "Even with the rising popularity of SUVs in the Indian market, hatchbacks still have a tenuous hold in the market, especially because of their affordable price tags. Maruti Suzuki Alto has been around since most of us were born. Recently, the brand introduced the all-new Alto K10, which was discontinued a couple of years ago. What does the all-new Alto K10 bring to the market? We drove the car around Kerala and this is what we think about the all-new Alto K10. We have explained everything about the new Maruti Alto K10 in this detailed first drive video that is shared below.\n\n  The all-new Maruti Suzuki Alto K10 sure looks like a Kei car. The hatchback gets the new HEARTECT platform that makes it bigger in size than before. While the dimensions grow marginally, the all-new Alto K10 also offers a new design. The new car gets a much larger grille than before and a clamshell-type bonnet. You might be able to see traces of the old A-Star’s design in the front of the car.The bumper is also new and the strong creases add a sense of youthful look to the car. There is no provision for fog lamps in the bumper. The headlamps, however, have been updated and are larger than before.\n\n  The new Alto K10 uses 13-inch steel rims with wheel covers. There is not much to talk about on the side design. There is a single crease that runs through the body of the new Alto K10. The door handles are flap-type and the side turn indicator is located on the body instead of the ORVM. The ORVMs are all-black and there is no option of a body-coloured version.\n\n  The rear of the all-new Alto K10 gets new tail lamps. The squarish tail lamps. Turn indicators, reverse lamp and brake lamps are all integrated into this unit. There is only a single reverse lamp in the car. The bumper at the rear is quite large, similar to the front bumper. There are two parking sensors but no factory-fitted camera.With the increase in dimensions, the cabin space has improved massively – this was a much-needed requirement for a refresh and its accomplished by Maruti here. There is boot space of 251 litres, which is ample to fit two overnighters. The rear seats are wide and have a good amount of support. However, the headrests are fixed. The fixed headrests do not provide adequate whiplash protection. The space is ample for two but the transmission tunnel will make the third passenger uncomfortable.",
//                 "image": "alto-k10.jpg"
//             },
//             {
//                 "title": "Maruti Suzuki Baleno Ride and Handling Review",
//                 "author": "Sonny",
//                 "category": "Hatchback",
//                 "article": "Which was the last Maruti Suzuki car that got you excited? Not many, right? The new Baleno however has definitely created a lot of excitement right from the moment Maruti Suzuki started releasing details of it well before its launch. But will this excitement last even after we have experienced it and driven it? More importantly,f does the new Baleno feel like a proper upgrade as compared to the old one?\n\n Where the old Baleno used to feel too stiff and uncomfortable over uneven roads, the new car feels significantly more pliant. Be it at city speeds or out on the highway, the new Baleno feels at home save for a bit of up and down motion especially for the rear passengers. The suspension too now works silently, which adds to the refined nature of this premium hatchback. High speed stability too has improved as it feels more hunkered down as compared to the old car. What has also improved is the sound insulation where wind and tyre noise is well controlled, which makes for a more relaxing drive.\n\n  The Baleno was always known to be a family friendly car and the new one is no different as it doesn't really enjoy being hustled around corners. The steering is slow, devoid of any feel and it also rolls quite a bit when pushed hard. As a result the Baleno feels comfortable when driven in a relaxed manner.\n\n  The brakes on the new Baleno have been improved thanks to a larger front disc. In our experience it has more than enough stopping power with a good pedal feel.",
//                 "image": "baleno.jpg"
//             },
//             {
//                 "title": "All-new Toyota Urban Cruiser based on new Brezza",
//                 "author": "Ajeesh Kuttan",
//                 "category": "Compact Suv",
//                 "article": "Maruti Suzuki recently launched the 2022 version of their popular compact SUV Brezza in the market. When compared to the previous version, Maruti has completely changed the overall design of the SUV. If you remember, Toyota also sells Brezza under the name Urban Cruiser. Toyota has not launched the updated or facelift version of Urban Cruiser in the market yet. There are reports that Toyota will not be launching a 2022 version of Urban Cruiser. There are several render videos and images available online that shows how 2022 version of Urban Cruiser might look like. Here we have one such video of Urban Cruiser which shows how the all-new 2022 Urban Cruiser based on the new Brezza would look like.\n\n  The previous model of Urban cruiser, the facelift version of the SUV will get a new front fascia. The artist has changed the front-end of the SUV in such a manner that it looks more Toyota than Suzuki. The lower grille on the Maruti Brezza was completely removed and replaced to give it a a different look. The lower grille design of Urban Cruiser is actually inspired from other international model from Toyota.The lower grille gets honey comb like design elements in it. The gloss grey horizontal slat in Brezza has been retained however, it looks a lot more sleeker in comparison to the one seen on the Brezza. A Toyota logo is placed on the centre of the grille and the headlamps design also remains the same. The car comes with dual-projector headlamps and the twin LED DRLs and turn indicators are all the same as Brezza. The bumper gets minor changes too. As the lower grille on the Urban Cruiser is wider, it was coming on the way of the original fog lamps. So the fog lamps were placed slightly higher than where they were originally in Brezza.\n\n  Lower part of the bumper also gets a faux skid plate. Other than this, no other changes have been made to the SUV. The alloy wheel design, the tail lamps, headlamps all remain the same. Toyota has not confirmed anything related the launch or discontinuation of Urban Cruiser from the market. The manufacturer recently unveiled its first ever mid-size SUV Urban Cruiser Hyryder in India. The official launch and deliveries for the same are expected to happen in next couple of months.",
//                 "image": "toyota-urban-cruiser.jpg"
//             },
//             {
//                 "title": "Ola’s first electric car will be priced between Rs. 40-50 lakh",
//                 "author": "Jayprashanth Mohanram",
//                 "category": "Electric",
//                 "article": "Ola Electric is working on its first electric car, which will be launched in the Indian market in the summer of 2024. The first Ola electric car is likely to be a luxury crossover and the company will take a top-down approach into India’s electric car market. Ola Electric’s CEO Bhavish Aggarwal has revealed that the brand’s first electric car would be priced between Rs. 40-50 lakh. Clearly, it’ll be a premium offering meant to build the brand for Ola Electric before more affordable electric cars are introduced.\n\n  Here’s what Bhavish Aggarwal, the Founder-CEO had to tell PTI about the brand’s first electric car, Ola’s product range will span Rs one lakh (entry two wheelers) to Rs 40-50 lakh (premium electric car) and the company’s vision is to be a “global leader in mid-size, small and premium electric cars which are suitable for markets and consumers like India. The e-car will be the “fastest and sportiest” in India. We definitely have a full roadmap in the works in the car space. We will definitely have cars at the entry price market. We’re starting with a premium car and that comes out in 18 to 24 months. We are envisioning across all the products (that) we will launch, maybe by 2026 or 2027 we will target a million cars a year by volume. Global automakers think that the Indian market is not ready for world class technology and hence sell their hand-me-down tech in India. Now we need to change this. We deserve a car that defines this new India, an India that is fearless and believes in writing its own destiny.\n\n  Ola’s first electric car is expected to have a range between 400-500 Kms, which is more than adequate for most buyers. A 0-100 Kph sprint time of less than 4 seconds will put the Ola Electric car in sportscar territory, and will make it the fastest car in the sub-Rs. 50 lakh segments. If Ola Electric gets the quality right and delivers a niggle-free product, their first electric car could easily become a cult-car given the promised performance numbers.\n\n",
//                 "image": "ola-electric.jpg"
//             }

//         ]);
//     }catch(error){
//         console.log('err', error.message);
//     }
// }

// insertDymyBlogData();