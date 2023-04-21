import Head from 'next/head';

import Logo from '../../../assets/Logo';
import { XButton } from '@/components/XButton';

export default function Login() {
	return (
		<div>
			<Head>
				<title>Login - Autentique-se no sistema</title>
			</Head>

			<main className='flex flex-col h-screen items-center justify-center bg-zinc-100'>
				<section className='flex flex-1 w-96 max-h-80 bg-white rounded-lg shadow-sm'>
					<div className='flex flex-1 flex-col items-center justify-center p-6 gap-2'>
						<Logo
							width={100}
							className='my-2'
						/>

						<form className='flex flex-col gap-2 w-full'>
							<input
								autoFocus
                                required
								type='text'
								placeholder='Usuário'
								className='p-2 h-10 rounded border border-zinc-200'
							/>
							<input
                                required
								type='password'
								placeholder='Senha'
								className='p-2 h-10 rounded border border-zinc-200'
							/>
							<XButton
								xType='Primary'
								xTitle='Entrar'
								type='submit'
							/>
						</form>
					</div>
				</section>
			</main>
		</div>
	);
}
