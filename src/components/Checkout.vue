<template>
    <div>
        <div class="cart-container">
            <h2>{{ cart.length > 0 ? 'Shopping Cart' : 'Checkout' }}</h2>

            <div v-if="cart.length === 0">
                <p>Your shopping cart is empty.</p>
            </div>
            <div v-else>
                <div v-for="cartLesson in cart" class="cart-item" :key="cartLesson.name">
                    <h3>{{ cartLesson.name }}</h3>
                    <!-- Display price and button to remove from Cart -->
                    <p>Price: {{ cartLesson.price }} AED</p>

                    <!--when clicked, triggers the removeFromCart method with the current cartLesson as an argument-->
                    <button v-on:click="removeItem(cartLesson)">Remove from Cart</button>
                </div>
            </div>

            <!--CHECKOUT PAGE-->
            <div v-if="cart.length > 0">

                <!-- Order information -->
                <h2>Order Information</h2>
                <p>
                    <strong>Full Name:</strong> <!--bold text-->
                    <input v-model.trim="order.fullName" @input="validateFullName" />

                    <span v-if="!validFullName && order.fullName !== ''" class="validation-error">Please enter a
                        valid full name with letters only.</span>
                </p>

                <p>
                    <strong>Phone Number:</strong>
                    <input v-model="order.phone" @input="validatePhone" />

                    <!-- Validation message for phone number -->
                    <span v-if="!validPhone && order.phone !== ''" class="validation-error">Please enter a valid
                        phone number.</span>
                </p>

                <!-- Place Order button -->
                <button v-on:click="submitForm" :disabled="!validOrderInfo">Checkout</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Checkout-Page",
    props: ['cart'],
    data() {
        return {
            order: {
                fullName: '', //input shud be empty, the textbox shouldnt have anything in it obviously
                phone: '',
            },
            // Validation flags for full name and phone number
            validFullName: false,
            validPhone: false,
        }
    },
    methods: {
        removeItem(index) {
            //Emit an event to notify the parent component to remove the item
            this.$emit('remove-item', index);
        },
        // Method to Validate full name using regex
        validateFullName() {
            const regex = /^[A-Za-z\s]+$/;
            this.validFullName = regex.test(this.order.fullName);
        },
        // Validate phone number using regex
        validatePhone() {
            const regex = /^[0-9]*$/;
            this.validPhone = regex.test(this.order.phone);
        },
        // AFTER ORDER IS SUBMITTED = ORDER SUBMITTED MESSAGE 
        submitForm() {
            alert('Order Submitted!');
            ////clears the user's input for full name and phone number after the order has been submitted.
            this.order = {
                fullName: '',
                phone: '',

            };
        },

    },
    computed: {
        validOrderInfo: function () {
            return this.validFullName && this.validPhone;
        },
    },

};
</script>
