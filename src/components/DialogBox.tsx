import { StyleSheet, View } from "react-native";
import Dialog from "react-native-dialog";

const DialogBox = ({ open, confirm, cancel }: any) => {

    const handleDelete = () => {
        confirm();
    }

    const handleCancel = () => {
        cancel();
    }

    return (
        open ? (
            <View style={styles.container}>
            <Dialog.Container visible={open}>
              <Dialog.Title>Category delete</Dialog.Title>
              <Dialog.Description>
                Do you want to delete this category? You cannot undo this action.
              </Dialog.Description>
              <Dialog.Button label="Cancel" onPress={handleCancel} />
              <Dialog.Button label="Delete" onPress={handleDelete} />
            </Dialog.Container>
          </View>
        ) : null
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default DialogBox;
