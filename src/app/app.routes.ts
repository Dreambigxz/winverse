import { Routes } from '@angular/router';
import { MainComponent  } from "./main/main.component";
import { ProfileComponent} from "./profile/profile.component";
import {  NotificationsComponent} from "./notifications/notifications.component";

import { LoginComponent} from "./auth/login/login.component";
import { RegisterComponent} from "./auth/register/register.component";
import { ResetComponent} from "./auth/reset/reset.component";

import {CreditAgentComponent} from './credit-agent/credit-agent.component'
import {PaymentConfirmationComponent} from './payment-confirmation/payment-confirmation.component'

import { PlansComponent } from "./plans/plans.component";

import { InvitesComponent } from "./invites/invites.component";
import { RewardComponent } from "./invites/reward/reward.component";
import { LuckyWheelComponent } from "./lucky-wheel/lucky-wheel.component";
import { authGuard } from './reuseables/auth/auth.guard';
import { AgentManagementComponent } from "./admin/agent-management/agent-management.component";

import { MatchesComponent} from "./matches/matches.component";
import { BetinfoComponent  } from "./betinfo/betinfo.component";
import { BethistoryComponent} from "./bethistory/bethistory.component";

import { WalletComponent } from "./wallet/wallet.component";
import { DepositComponent } from "./wallet/deposit/deposit.component";
import { SetupComponent } from "./wallet/setup/setup.component";
import { WithdrawComponent } from "./wallet/withdraw/withdraw.component";
import { TransactionComponent } from "./wallet/transaction/transaction.component";

import { VipComponent } from "./vip/vip.component";
import { ReferralComponent } from "./invites/referral/referral.component";
import { RebateComponent } from "./invites/rebate/rebate.component";
import { UsersComponent } from "./invites/users/users.component";

import { BindComponent } from "./components/telegram/bind/bind.component";
export const routes: Routes = [

    {
      path: '',
      component: MainComponent,
      title: 'Main',
      // canActivate: [authGuard]
    },

    {
      path: 'matches',
      component: MatchesComponent,
      title: 'Matches',
      canActivate: [authGuard]
    },
    {
      path: 'game-details/:id',
      component: BetinfoComponent,
      title: 'Game-details',
      canActivate: [authGuard]
    },

    {
      path: 'trade',
      component: BethistoryComponent,
      title: 'Trade-History',
      canActivate: [authGuard]
    },

    {
      path: 'notifications',
      component: NotificationsComponent,
      title: 'Notifications',
      canActivate: [authGuard]
    },

    {
      path: 'transaction',
      component: TransactionComponent,
      title: 'Transaction',
      canActivate: [authGuard]
    },
    {
      path: 'deposit',
      component: DepositComponent,
      title: 'Deposit',
      canActivate: [authGuard]
    },
    {
      path: 'withdraw',
      component: WithdrawComponent,
      title: 'Withdraw',
      canActivate: [authGuard]
    },
    {
      path: 'setup',
      component: SetupComponent,
      title: 'Setup',
      canActivate: [authGuard]
    },
    {
      path: 'tg-bind',
      component: BindComponent,
      title: 'Bind',
      canActivate: [authGuard]
    },

    {
      path: 'invite',
      component: InvitesComponent,
      title: 'Invited-users',
      canActivate: [authGuard]
    },
    {
      path: 'invite/referrals',
      component: ReferralComponent,
      title: 'My earnings',
      canActivate: [authGuard]
    },
    {
      path: 'invite/rebate',
      component: RebateComponent,
      title: 'My earnings',
      canActivate: [authGuard]
    },
    {
      path: 'invite/users',
      component: UsersComponent,
      title: 'Users',
      canActivate: [authGuard]
    },

    {
      path: 'invite-rewards',
      component: RewardComponent,
      title: 'Invite-rewards',
      canActivate: [authGuard]
    },

    {
      path: 'account',
      component: ProfileComponent,
      title: 'Account',
      canActivate: [authGuard]
    },

    // vi routers
    {
      path: 'vip',
      component: VipComponent,
      title: 'vip',
      canActivate: [authGuard]

    },
    {
      path: 'my-plan',
      component: PlansComponent,
      title: 'Plan',
      canActivate: [authGuard]

    },
    // luck wheel
    {
      path: 'lucky-wheel',
      component: LuckyWheelComponent,
      title: 'Voucher:Lucky We=heel',
      canActivate: [authGuard]

    },

    // agent administration paths
    {
      path: 'confirm-payment',
      component: PaymentConfirmationComponent,
      title: 'Confirmation',
      canActivate: [authGuard]

    },

    {
      path: 'credit-agent',
      component: CreditAgentComponent,
      title: 'Credit-Agent',
      canActivate: [authGuard]

    },
    {
      path: 'agent-management',
      component: AgentManagementComponent,
      title: 'Agent-management',
      canActivate: [authGuard]

    },
    // auth  paths (anonymous users)
    // {
    //   path: 'login',
    //   component: LoginComponent,
    //   title: 'Login',
    // },
    // {
    //   path: 'sign-up',
    //   component: RegisterComponent,
    //   title: 'Register',
    // },
    // {
    //   path: 'reset-password',
    //   component: ResetComponent,
    //   title: 'Reset',
    // },

];
