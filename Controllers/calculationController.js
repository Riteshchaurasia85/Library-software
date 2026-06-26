const Calculation = require('../models/Calculation');

exports.homePage = (req, res) => {
    res.render("index", {
        pageTitle: "Library Dashboard",
        activePage: "home",
        content: "pages/home"
    });
};

exports.saveCalculation = async(req,res)=>{
    try{
        const newCalculation = new Calculation({
            result:req.body.result
        });

        await newCalculation.save();

        res.json({
            success:true
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Error saving calculation"
        });
    }
};

exports.calculate = (req, res) => {
    try {
        const { num1, num2, operation } = req.body;

        if (num1 === undefined || num2 === undefined || !operation) {
            return res.status(400).json({
                success: false,
                message: "Invalid input"
            });
        }

        const a = parseFloat(num1);
        const b = parseFloat(num2);

        if (isNaN(a) || isNaN(b)) {
            return res.status(400).json({
                success: false,
                message: "Numbers must be valid"
            });
        }

        let result;

        switch (operation) {
            case "+":
                result = a + b;
                break;
            case "-":
                result = a - b;
                break;
            case "*":
                result = a * b;
                break;
            case "/":
                if (b === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Cannot divide by zero"
                    });
                }
                result = a / b;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid operation"
                });
        }

        res.json({
            success: true,
            result
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Calculation failed"
        });
    }
};