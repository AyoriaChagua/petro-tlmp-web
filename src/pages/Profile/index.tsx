import { Button, Input, Tag } from "../../components";
import { useProfile } from "../../hooks/useProfile";

export default function Profile() {
    const {
        profile,
        isChangePass,
        setIsChangePass,
        handleInputPasswordChange,
        newPassFormRequest,
        changePassword
    } = useProfile();

    return (
        <div className="h-[calc(100vh-18rem)] flex flex-col justify-center items-center w-full px-2 lg:px-32 xl:px-40 2xl:px-80 lg:pt-20 pt-12">
            <div className="w-full border-2 border-gray-300 rounded-xl">
                <div className="p-5">
                    <h3 className="text-2xl md:text-3xl text-gray-600 font-semibold">{isChangePass ? "Cambia tu contraseña" : "Tu perfil"}</h3>
                    <div className="text-base text-gray-500 mt-2">{isChangePass ? "Si olvidaste tu antigua contraseña contacta a un usuario administrador para que pueda cambiarla" : "Si deseas cambiar tu nombre comunicate con un administrador"}</div>
                </div>
                <hr className="mb-3" />
                <div>

                    {
                        isChangePass ?
                            <>

                                <div className="grid grid-cols-5 gap-4 items-start px-5">
                                    <p className="text-base  text-gray-500 font-semibold col-span-3">Antigua contraseña:</p>
                                    <div className="flex flex-wrap gap-2 col-span-2">
                                        <Input
                                            id="oldPassword"
                                            type="password"
                                            onChange={(e) => handleInputPasswordChange(e.target.value, "oldPassword")}
                                            value={newPassFormRequest.oldPassword}
                                        />
                                    </div>

                                </div>

                                <hr className="border-gray-300 my-5" />

                                <div className="grid grid-cols-5 gap-4 items-start px-5">
                                    <p className="text-base  text-gray-500 font-semibold col-span-3">Nueva contraseña:</p>
                                    <div className="flex flex-wrap gap-2 col-span-2">
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            onChange={(e) => handleInputPasswordChange(e.target.value, "newPassword")}
                                            value={newPassFormRequest.newPassword}
                                        />
                                    </div>

                                </div>

                                <hr className="border-gray-300 my-5" />

                                <div className="grid grid-cols-5 gap-4 items-start px-5">
                                    <p className="text-base  text-gray-500 font-semibold col-span-3">Confirmar contraseña:</p>
                                    <div className="flex flex-wrap gap-2 col-span-2">
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            onChange={(e) => handleInputPasswordChange(e.target.value, "confirmPassword")}
                                            value={newPassFormRequest.confirmPassword}
                                        />
                                    </div>

                                </div>

                            </> :
                            <>
                                <div className="grid grid-cols-5 gap-4 items-center px-5">
                                    <p className="text-base text-gray-500 font-semibold col-span-2">ID de usuario:</p>
                                    <p className="text-base  text-gray-500 col-span-3">{profile?.id.toUpperCase()}</p>
                                </div>
                                <hr className="border-gray-300 my-5" />
                                <div className="grid grid-cols-5 gap-4 items-center px-5">
                                    <p className="text-base  text-gray-500 font-semibold col-span-2">Nombre completo:</p>
                                    <p className="text-base  text-gray-500 col-span-3">{profile?.description.toUpperCase()}</p>
                                </div>
                                <hr className="border-gray-300 my-5" />
                                <div className="grid grid-cols-5 gap-4 items-start px-5">
                                    <p className="text-base  text-gray-500 font-semibold col-span-2">Roles de usuario:</p>
                                    <div className="flex flex-wrap gap-2 col-span-3">
                                        {profile?.roles.map((rol) => (
                                            <Tag text={rol} key={rol} />
                                        ))}
                                    </div>
                                </div>
                            </>
                    }
                    <hr className="border-gray-300 my-5" />
                    <div className="grid grid-cols-6 items-start px-5 mb-5">
                        <div className="col-span-6">
                            <div className="flex flex-row w-full gap-2">
                                <Button
                                    styleType="dark"
                                    text={isChangePass ? "Cancelar" : "Cambiar contraseña"}
                                    type="button"
                                    isFilled
                                    onClick={() => setIsChangePass(!isChangePass)}
                                />
                                {isChangePass &&
                                    <Button
                                        styleType="primary"
                                        text="Guardar"
                                        type="button"
                                        onClick={changePassword}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}