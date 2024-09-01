import { CustomSelect, Input } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { convertToOptions } from '../../utils/functions';
import { OptionType } from '../../types/common/inputs';

export default function Login() {

    const {
        companies,
        handleSelectCompany,
        handleLogin,
        setUserId,
        setPassword,
        userId,
        password
    } = useAuth();
    console.log("por que?")
    let optionsCompanies: OptionType[] = []

    if (companies && companies.length > 0) {
        optionsCompanies = convertToOptions({
            data: companies,
            labelKey: 'description',
            valueKey: 'companyId'
        })
    }

    return (
        <div className='justify-center w-full m-5 md:m-0 md:w-1/2 border border-[#055CBB] p-10 bg-white rounded-xl'>
            <h2 className='text-xl text-[#055CBB] font-bold mb-3'>INGRESAR</h2>
            <form onSubmit={handleLogin}>
                <Input
                    id='userId'
                    label='Usuario'
                    onChange={(e) => setUserId(e.target.value)}
                    value={userId}
                />
                <Input
                    id='password'
                    label='Contraseña'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type='password'
                />
                <CustomSelect
                    id='companiesSelectLogin'
                    label='Compañías'
                    placeholder='Seleccione una compañía'
                    options={optionsCompanies}
                    onChange={handleSelectCompany}
                    typeForm='create'
                />
                <button type='submit' className='mt-4 bg-[#055CBB] w-full text-white rounded-xl px-4 py-2'>
                    Ingresar
                </button>
            </form>
        </div>
    )
}
