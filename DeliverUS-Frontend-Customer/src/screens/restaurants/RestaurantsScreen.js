/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, View, ScrollView } from 'react-native'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { getAllRestaurants } from '../../api/RestaurantEndpoints'
import { showMessage } from 'react-native-flash-message'
import ImageCard from '../../components/ImageCard'
import restaurantLogo from '../../../assets/logo.png'
import productImage from '../../../assets/product.jpeg'
import { getTopProducts } from '../../api/ProductEndpoints'
export default function RestaurantsScreen ({ navigation, route }) {
  // TODO: Create a state for storing the restaurants
  const [restaurants, setRestaurants] = useState([])
  const [topProducts, setTopProducts] = useState([])
  // TODO: Fetch all restaurants and set them to state.
  //      Notice that it is not required to be logged in.
  // TODO: set restaurants to state
  useEffect(() => {
    async function fetchRestaurants () {
      try {
        const fetchedRestaurants = await getAllRestaurants()
        setRestaurants(fetchedRestaurants)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchRestaurants()
  }, [route])
  useEffect(() => {
    async function fetchTopProducts () {
      try {
        const fetchedProducts = await getTopProducts()
        setTopProducts(fetchedProducts)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving the 3 top products. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchTopProducts()
  }, [route, topProducts])
  const renderRestaurant = ({ item }) => {
    return (
      <ImageCard
      imageUri = {item.logo ? { uri: process.env.API_BASE_URL + '/' + item.logo } : restaurantLogo}
      title={item.name}
      onPress={() => {
        navigation.navigate('RestaurantDetailScreen', { id: item.id })
      }}
      >
      <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        {item.averageServiceMinutes !== null &&
          <TextSemiBold>Avg. service time: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>}
      <TextSemiBold>Shipping: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
      </ImageCard>
    )
  }
  const renderTopProducts = ({ item }) => {
    return (
      <View style={styles.product}>
      <ImageCard
      imageUri = {item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : productImage}
      title={item.name}
      onPress={() => {
        navigation.navigate('RestaurantDetailScreen', { id: item.restaurant.id })
      }}
      >
      <TextSemiBold>Description: <TextRegular>{item.description}</TextRegular></TextSemiBold>
      <TextSemiBold>Price: <TextSemiBold textStyle={{ color: 'black' }}>{item.price}€</TextSemiBold></TextSemiBold>
      </ImageCard>
      </View>
    )
  }
  const renderEmptyRestaurantsList = () => {
    return (
      <TextSemiBold textStyle={styles.emptyList}>
        No restaurants were retreived.
      </TextSemiBold>
    )
  }
  const renderEmptyTopProductsList = () => {
    return (
      <TextRegular>
        No top products were retreived.
      </TextRegular>
    )
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style= {styles.popProducts}>
        <TextSemiBold style={styles.bigText}>Top Products</TextSemiBold>
        <FlatList
        horizontal={true}
        data={topProducts}
        renderItem={renderTopProducts}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyTopProductsList}
        />
      </View>
      <View style={styles.restaurants}>
        <TextSemiBold style={styles.bigText}>Restaurants</TextSemiBold>
        <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyRestaurantsList}
        />
      </View>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  FRHeader: { // TODO: remove this style and the related <View>. Only for clarification purposes
    justifyContent: 'center',
    alignItems: 'left',
    margin: 50
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    margin: 12,
    padding: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
