import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, FlatList, Platform} from "react-native";
import {Container, Content, Header, Button, Left, Icon, Body, Title} from 'native-base'
import styles from '../../assets/style'
import {DoubleBounce} from 'react-native-loader';
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";
import * as Animatable from 'react-native-animatable';
import {getCartProducts, deleteCart} from '../actions'
import i18n from "../../locale/i18n";
import CartItem from './CartItem'

import COLORS from "../consts/colors";

const isIOS = Platform.OS === 'ios';

let cartItems = [];


class DetailsBasket extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 1,
            totalPrice: 0
        }
    }

    componentWillMount() {
		cartItems   = [];
		this.setState({ totalPrice: 0 });

        const provider_id = this.props.navigation.state.params.provider_id
        this.props.getCartProducts(this.props.lang, provider_id, this.props.user.token, this.props)
    }

	pushCartItems(cart_id , price){
		if (cartItems.includes(cart_id) === false) {
			cartItems.push(cart_id);
			const totalPrice = Number(this.state.totalPrice) + Number(price);
			setTimeout(() => this.setState({ totalPrice }), 0)
		}

		console.log('selected items_', cartItems , 'current total price ' , this.state.totalPrice);
	}

	pullCartItems(cart_id , price){
		for( var i = 0; i < cartItems.length; i++){
			if ( cartItems[i] === cart_id) {
				cartItems.splice(i, 1);
				const totalPrice = Number(this.state.totalPrice) - Number(price);
				setTimeout(() => this.setState({ totalPrice }), 0)
			}
		}

		console.log('selected items_', cartItems , 'current total price ' ,this.state.totalPrice );
	}

    static navigationOptions = () => ({
        header: null,
        drawerLabel: (<Text style={styles.textLabel}>{i18n.t('home')}</Text>),
        drawerIcon: (<Icon style={styles.icon} type="SimpleLineIcons" name="home"/>)
    });

    componentWillReceiveProps(nextProps) {
        if (nextProps.cartProducts.prices)
            this.setState({ totalPrice: nextProps.cartProducts.prices.products_price });
	}

	renderLoader() {
        if (this.props.loader) {
            return (
                <View style={[styles.loading, styles.flexCenter]}>
                    <DoubleBounce size={20}/>
                </View>
            );
        }
    }

    _keyExtractor = (item, index) => item.id;

    renderItems = (item, key) => {
		const providerId = this.props.navigation.state.params.provider_id;
        return (
			<CartItem item={item} pushItem={(cart_id, price) => this.pushCartItems(cart_id, price)} pullItem={(cart_id, price) => this.pullCartItems(cart_id, price)} key={key} providerId={providerId} navigation={this.props.navigation} />
        );
    };


    onFocus() {
        this.componentWillMount();
    }

    render() {

        return (
            <Container>

                {this.renderLoader()}

                <NavigationEvents onWillFocus={() => this.onFocus()}/>

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right'/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title
                            style={[styles.textRegular, styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                            {i18n.t('basket')}
                        </Title>
                    </Body>
                </Header>
                <ImageBackground source={require('../../assets/images/bg_img.png')} style={[styles.bgFullWidth]}>
                <Content contentContainerStyle={styles.bgFullWidth} style={styles.bgFullWidth}>
                    {this.renderLoader()}

                        {
                            this.props.cartProducts ?

                                <View>
                                    <FlatList
                                        data={this.props.cartProducts.products}
                                        renderItem={({item}) => this.renderItems(item)}
                                        numColumns={2}
                                        keyExtractor={this._keyExtractor}
                                    />
                                    <View
                                        style={[styles.rowGroup, styles.bg_White, styles.Border, styles.paddingHorizontal_10, styles.paddingVertical_10, styles.marginVertical_10, styles.marginHorizontal_15]}>
                                        <Text style={[styles.textBold, styles.text_black, styles.textSize_14]}>
                                            {i18n.t('priceprod')}
                                        </Text>
                                        <Text
                                            style={[styles.textBold, styles.text_black, styles.textSize_14]}>{this.state.totalPrice} {i18n.t('RS')}</Text>
                                    </View>

                                    <View
                                        style={[styles.rowGroup, styles.bg_White, styles.Border, styles.paddingHorizontal_10, styles.paddingVertical_10, styles.marginVertical_10, styles.marginHorizontal_15]}>
                                        <Text style={[styles.textBold, styles.text_black, styles.textSize_14]}>
                                            {i18n.t('deliveryprice')}
                                        </Text>
                                        <Text
                                            style={[styles.textBold, styles.text_black, styles.textSize_14]}>{this.props.cartProducts.prices.shipping_price} {i18n.t('RS')}</Text>
                                    </View>

                                    <View
                                        style={[styles.rowGroup, styles.bg_black, styles.Border, styles.paddingHorizontal_10, styles.paddingVertical_10, styles.marginVertical_10, styles.marginHorizontal_15]}>
                                        <Text style={[styles.textBold, styles.text_White, styles.textSize_14]}>
                                            {i18n.t('totalprice')}
                                        </Text>
                                        <Text style={[styles.textBold, styles.text_White, styles.textSize_14]}>{Number(this.state.totalPrice) + Number(this.props.cartProducts.prices.shipping_price)} {i18n.t('RS')}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={[
                                            styles.bg_orange,
                                            styles.width_150,
                                            styles.flexCenter,
                                            styles.marginVertical_15,
                                            styles.height_40
                                        ]}
                                        onPress={() => this.props.navigation.navigate('MapLocation', {
                                            pageName: this.props.navigation.state.routeName
                                            ,
                                            provider_id: this.props.navigation.state.params.provider_id,
                                            shipping_price: this.props.cartProducts.prices.shipping_price
                                        })}>
                                        <Text style={[styles.textBold, styles.textSize_16, styles.text_White]}>
                                            {i18n.translate('confirm')}
                                        </Text>
                                    </TouchableOpacity>
                                </View> :
                                <View/>
                        }
                </Content>
                </ImageBackground>
            </Container>

        );
    }
}

const mapStateToProps = ({lang, profile, cartProducts}) => {
    return {
        lang: lang.lang,
        user: profile.user,
        cartProducts: cartProducts.cartProducts
    };
};
export default connect(mapStateToProps, {getCartProducts, deleteCart})(DetailsBasket);
